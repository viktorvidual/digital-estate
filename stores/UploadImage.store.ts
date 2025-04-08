import { create } from 'zustand';

type UploadImageStore = {
  localImage: string;
  setLocalImage: (image: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  imageDimensions: { width: number; height: number };
  setImageDimensions: ({ width, height }: { width: number; height: number }) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  removeFurniture: boolean;
  setRemoveFurniure: (bool: boolean) => void;
  addNewFurniture: boolean;
  setAddNewFurniture: (bool: boolean) => void;
  maskedImageUrl: string;
  setMaskedImageUrl: (url: string) => void;
  maskId: string;
  setMaskId: (maskId: string) => void;
  reset: () => void;
};

const initialState = {
  addNewFurniture: false,
  removeFurniture: false,
  localImage: '',
  selectedFile: null,
  imageDimensions: { width: 0, height: 0 },
  uploading: false,
  maskedImageUrl: '',
  maskId: '',
};

export const useUploadImageStore = create<UploadImageStore>(set => ({
  ...initialState,

  setAddNewFurniture: bool => set({ addNewFurniture: bool }),
  setRemoveFurniure: bool => set({ removeFurniture: bool }),
  setLocalImage: image => set({ localImage: image }),
  setSelectedFile: file => set({ selectedFile: file }),
  setImageDimensions: ({ width, height }) => set({ imageDimensions: { width, height } }),
  setUploading: status => set({ uploading: status }),
  setMaskedImageUrl: url => set({ maskedImageUrl: url }),
  setMaskId: maskId => set({ maskId }),
  reset: () => set(initialState),
}));
