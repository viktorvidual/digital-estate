import { create } from 'zustand';
import { generateMask, saveTemporaryFromBlob, saveTemporaryImage } from '@/services';
import { supabase } from '@/lib/supabase';
import { UploadImageStore, initialState } from './UploadImage.store.types';
import { dataURLToBlob, generateBlackAndWhiteMaskBinary } from '@/utils';

export const useUploadImageStore = create<UploadImageStore>((set, get) => ({
  ...initialState,

  setAddVirtuallyStagedWatermark: bool => set({ addVirtuallyStagedWatermark: bool }),
  setAddNewFurniture: bool => set({ addNewFurniture: bool }),
  setRemoveFurniure: bool => set({ removeFurniture: bool }),
  setLocalImage: image => set({ localImage: image }),
  setSelectedFile: file => set({ selectedFile: file }),
  setImageDimensions: ({ width, height }) => set({ imageDimensions: { width, height } }),
  setUploading: status => set({ uploading: status }),
  setUploadingMessage: uploadingMessage => set({ uploadingMessage }),
  setMaskedImageUrl: url => set({ maskedImageUrl: url }),
  setMaskId: maskId => set({ maskId }),
  setRoomType: roomType => set({ roomType }),
  setFurnitureStyle: furnitureStyle => set({ furnitureStyle }),
  reset: () => set(initialState),

  pickImage: (customer, event, showToast, inputRef) => {
    const { setSelectedFile, setLocalImage, setImageDimensions } = get();

    if (!customer) {
      showToast({
        title: 'No customer found',
        description: 'Please log out and log in again.',
        type: 'error',
      });
      return;
    }

    const file = event.target.files?.[0];

    if (!file) return;

    if (file.name.includes('HEIC') || file.name.includes('HEIF')) {
      inputRef.current!.value = '';
      showToast({
        title: 'HEIC/HEIF файлове не се поддържат.',
        description: 'Моля, качете JPEG или PNG файл.',
        type: 'error',
      });
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLocalImage(previewUrl);

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  },

  deleteImage: () => {
    const {
      setLocalImage,
      setSelectedFile,
      setMaskedImageUrl,
      setMaskId,
      uploading,
      setUploading,
    } = get();

    setLocalImage('');
    setSelectedFile(null);
    setMaskedImageUrl('');
    setMaskId('');
    if (uploading) {
      setUploading(false);
    }
  },

  uploadImageForMask: async (customer, showToast) => {
    const { selectedFile, removeFurniture, setUploading, setMaskId, maskId } = get();

    if (!customer) {
      return console.error('No customer object does not exist.');
    } else if (!selectedFile) {
      return console.log('No selected file');
    } else if (!removeFurniture) {
      return console.log('Furniter will not be removed, no need to upload temporary image');
    } else if (maskId) {
      console.log('Mask ID already exists, no need to upload temporary image');
      return;
    }

    //check if the image has changed and needs a new mask

    setUploading(true);

    const { error, data: temporaryUrl } = await saveTemporaryImage(customer.userId, selectedFile);

    if (error || !temporaryUrl) {
      setUploading(false);
      return console.warn(error || 'No temporary url response');
    }

    const { error: generateMaskError, data: newMaskId } = await generateMask(
      temporaryUrl,
      customer.userId
    );

    if (generateMaskError || !newMaskId) {
      setUploading(false);
      showToast({
        title: 'Грешка',
        description:
          'Не успяхме да сканираме изображението за премахване на мебелите. Моля опитайте отново.',
        type: 'error',
      });
      return;
    }

    setMaskId(newMaskId);
  },

  subscribeToMaskUpdates: currentChannel => {
    const { maskId, removeFurniture } = get();

    if (currentChannel) {
      supabase.removeChannel(currentChannel);
    }

    if (!maskId || !removeFurniture) {
      return;
    }

    currentChannel = supabase
      .channel('mask-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'masks',
          filter: `mask_id=eq.${maskId}`,
        },
        payload => {
          const newMaskUrl = payload.new.url;
          if (newMaskUrl) {
            set({
              maskedImageUrl: newMaskUrl,
              uploading: false,
            });
          }
        }
      )
      .subscribe();
  },

  unsubscribeFromMaskUpdates: currentChannel => {
    if (currentChannel) {
      supabase.removeChannel(currentChannel);
      currentChannel = null;
      set({ uploading: false });
    }
  },

  // Mask Canva Editing
  toggleEditMask: () => {
    const { editMask } = get();

    if (!editMask) {
      return set({
        editMask: true,
        paintMode: true,
      });
    }

    set({ editMask: !editMask, paintMode: false, eraseMode: false });
  },

  togglePaintMode: () => {
    const { paintMode, eraseMode } = get();
    if (eraseMode) {
      set({ eraseMode: false });
    }
    set({ paintMode: !paintMode });
  },

  toggleEraseMode: () => {
    const { paintMode, eraseMode } = get();
    if (paintMode) {
      set({ paintMode: false });
    }
    set({ eraseMode: !eraseMode });
  },

  setMaskHasBeenEdited: maskHasBeenEdited => set({ maskHasBeenEdited }),

  uploadNewMask: async userId => {
    const maskCanvas = get().canvasRef.current;

    if (!maskCanvas) {
      console.error('No mask canvas found');
      return {
        error: 'No mask canvas found',
      };
    }

    const blackAndWhiteBinary = generateBlackAndWhiteMaskBinary(maskCanvas);

    if (!blackAndWhiteBinary) {
      console.error('Failed to generate black and white binary mask');
      return {
        error: 'Failed to generate black and white binary mask',
      };
    }

    const maskBlob = dataURLToBlob(blackAndWhiteBinary);

    const response = await saveTemporaryFromBlob(userId, maskBlob);

    return response;
  },
}));
