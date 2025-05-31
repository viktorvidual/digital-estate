import { RoomType, FurnitureStyle, ROOM_TYPES, FURNITURE_STYLES } from '@/constants';
import { Customer } from '../Auth.store';
import { ShowToast } from '@/hooks';
import { supabase } from '@/lib/supabase';

export const initialState = {
  addNewFurniture: false,
  removeFurniture: false,
  localImage: '',
  selectedFile: null as File | null,
  imageDimensions: { width: 0, height: 0 },
  uploading: false,
  uploadingMessage: '',
  maskedImageUrl: '',
  roomType: ROOM_TYPES[0],
  furnitureStyle: FURNITURE_STYLES[0],
  maskId: '',
  addVirtuallyStagedWatermark: false,

  //Handle Mask Editing
  canvasRef: { current: null as HTMLCanvasElement | null },
  editMask: false,
  paintMode: false,
  eraseMode: false,
  maskHasBeenEdited: false,
};

type UploadImageState = typeof initialState;

type UploadImageActions = {
  setAddVirtuallyStagedWatermark: (bool: boolean) => void;
  setLocalImage: (image: string) => void;
  setSelectedFile: (file: File | null) => void;
  setImageDimensions: (dims: { width: number; height: number }) => void;
  setUploading: (uploading: boolean) => void;
  setUploadingMessage: (message: string) => void;
  setRemoveFurniure: (bool: boolean) => void;
  setAddNewFurniture: (bool: boolean) => void;
  setMaskedImageUrl: (url: string) => void;
  setMaskId: (id: string) => void;
  setRoomType: (roomType: RoomType) => void;
  setFurnitureStyle: (style: FurnitureStyle) => void;
  reset: () => void;
  toggleEditMask: () => void;
  togglePaintMode: () => void;
  toggleEraseMode: () => void;
  setMaskHasBeenEdited: (maskHasBeenEdited: boolean) => void;

  pickImage: (
    customer: Customer | null,
    event: React.ChangeEvent<HTMLInputElement>,
    showToast: ShowToast,
    inputRef: React.RefObject<HTMLInputElement>
  ) => void;
  deleteImage: () => void;
  uploadImageForMask: (customer: Customer | null, showToast: ShowToast) => Promise<void>;
  subscribeToMaskUpdates: (channel: ReturnType<typeof supabase.channel> | null) => void;
  unsubscribeFromMaskUpdates: (channel: ReturnType<typeof supabase.channel> | null) => void;
  uploadNewMask: (userId: string) => Promise<
    | {
        error: string;
        data?: undefined;
      }
    | {
        data: string;
        error?: undefined;
      }
  >;
};

export type UploadImageStore = UploadImageState & UploadImageActions;
