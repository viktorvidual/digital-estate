import { create } from 'zustand';

type UploagImageStore = {
  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  imageDimensions: { width: number; height: number };
  setImageDimensions: ({ width, height }: { width: number; height: number }) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
};

export const useUploadImageStore = create<UploagImageStore>(set => ({
  selectedFile: null,
  setSelectedFile: file => set({ selectedFile: file }),
  imageDimensions: { width: 0, height: 0 },
  setImageDimensions: ({ width, height }) => set({ imageDimensions: { width, height } }),
  uploading: false,
  setUploading: status => set({ uploading: status }),
}));
