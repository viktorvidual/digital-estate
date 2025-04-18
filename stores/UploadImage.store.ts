import { create } from 'zustand';
import { RoomType, FurnitureStyle, ROOM_TYPES, FURNITURE_STYLES } from '@/constants';

type UploadImageStore = {
  localImage: string;
  selectedFile: File | null;
  imageDimensions: { width: number; height: number };
  uploading: boolean;
  uploadingMessage: string;
  removeFurniture: boolean;
  addNewFurniture: boolean;
  maskedImageUrl: string;
  maskId: string;
  roomType: RoomType;
  furnitureStyle: FurnitureStyle;
  addVirtuallyStagedWatermark: boolean;

  setAddVirtuallyStagedWatermark: (bool: boolean) => void;
  setLocalImage: (image: string) => void;
  setSelectedFile: (file: File | null) => void;
  setImageDimensions: ({ width, height }: { width: number; height: number }) => void;
  setUploading: (uploading: boolean) => void;
  setUploadingMessage: (uploadingMessage: string) => void;
  setRemoveFurniure: (bool: boolean) => void;
  setAddNewFurniture: (bool: boolean) => void;
  setMaskedImageUrl: (url: string) => void;
  setMaskId: (maskId: string) => void;
  setRoomType: (roomType: RoomType) => void;
  setFurnitureStyle: (furnitureStyle: FurnitureStyle) => void;
  reset: () => void;
};

const initialState = {
  addNewFurniture: false,
  removeFurniture: false,
  localImage: '',
  selectedFile: null,
  imageDimensions: { width: 0, height: 0 },
  uploading: false,
  uploadingMessage: '',
  maskedImageUrl: '',
  roomType: ROOM_TYPES[0],
  furnitureStyle: FURNITURE_STYLES[0],
  maskId: '',
  addVirtuallyStagedWatermark: false,
};

export const useUploadImageStore = create<UploadImageStore>(set => ({
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
}));
