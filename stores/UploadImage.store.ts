import { create } from 'zustand';

type UploagImageStore = {
  localImage: string;
  setLocalImage: (image: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  imageDimensions: { width: number; height: number };
  setImageDimensions: ({ width, height }: { width: number; height: number }) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  removeFurniture: boolean;
  setRemoveFurniure: (bool: boolean) => void;
  addNewFurniture: boolean;
  setAddNewFurniture: (bool: boolean) => void;
};

export const useUploadImageStore = create<UploagImageStore>(set => ({
  addNewFurniture: false,
  setAddNewFurniture: bool => set({ addNewFurniture: bool }),
  removeFurniture: false,
  setRemoveFurniure: bool => set({ removeFurniture: bool }),
  localImage: '',
  setLocalImage: image => set({ localImage: image }),
  selectedFile: null,
  setSelectedFile: file => set({ selectedFile: file }),
  imageDimensions: { width: 0, height: 0 },
  setImageDimensions: ({ width, height }) => set({ imageDimensions: { width, height } }),
  uploading: false,
  setUploading: status => set({ uploading: status }),
}));
