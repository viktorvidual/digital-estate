import { Render } from '@/types';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

type PhotosListStore = {
  renders: Render[];
  setRenders: (renders: Render[]) => void;
  addRender: (render: Render) => void;
};

const baseState = {
  renders: [] as Render[],
};

export const usePhotosListStore = create<PhotosListStore>((set, get) => ({
  ...baseState,
  setRenders: renders => set({ renders }),
  addRender: render => {
    let currentRender = { ...render };
    if (!render.thumbnaiUrl) {
      const thumbnailUrl = supabase.storage.from('images').getPublicUrl(render.filePath, {
        transform: {
          width: 200,
          height: 200,
        },
      });
      currentRender = {
        ...render,
        thumbnaiUrl: thumbnailUrl.data.publicUrl,
      };
    }
    set({ renders: [currentRender, ...get().renders] });
  },
}));
