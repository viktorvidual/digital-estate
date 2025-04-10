import { create } from 'zustand';
import { Render } from '@/types/Render';

type Variation = {
  variationId: string;
  imageUrl: string;
  filePath: string;
  userId: string;
  url: string;
};

type ViewRenderStore = {
  render: Render | null;
  setRender: (render: Render) => void;
  variations: Variation[];
  setVariations: (variations: Variation[]) => void;
};

export const useViewRenderStore = create<ViewRenderStore>((set, get) => ({
  render: null,
  setRender: render => set({ render }),
  variations: [],
  setVariations: variations => set({ variations }),
  addVariations: (newVariations: Variation[]) =>
    set({
      variations: [...get().variations, ...newVariations],
    }),
  reset: () => set({ render: null, variations: [] }),
}));
