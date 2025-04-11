import { create } from 'zustand';
import { Render, Variation } from '@/types';
import { FurnitureStyle, RoomType } from '@/constants';

type ViewRenderStore = {
  render: Render | null;
  variations: Variation[];
  roomType: RoomType;
  furnitureStyle: FurnitureStyle;
  currentIndex: number;
  updateVariation: (variation: Variation) => void;
  setCurrentIndex: (index: number) => void;
  addVariations: (variations: Variation[]) => void;
  setRoomType: (roomType: RoomType) => void;
  setFurnitureStyle: (furnitureStyle: FurnitureStyle) => void;
  setRender: (render: Render) => void;
  setVariations: (variations: Variation[]) => void;
  reset: () => void;
};

export const useViewRenderStore = create<ViewRenderStore>((set, get) => ({
  render: null,
  roomType: {} as RoomType,
  furnitureStyle: {} as FurnitureStyle,
  variations: [],
  currentIndex: 0,
  updateVariation: variantion => {
    set(state => ({
      variations: state.variations.map(el =>
        el.variationId === variantion.variationId ? variantion : { ...el }
      ),
    }));
  },
  setCurrentIndex: index => set({ currentIndex: index }),
  setRoomType: roomType => set({ roomType }),
  setFurnitureStyle: furnitureStyle => set({ furnitureStyle }),
  setRender: render => set({ render }),
  setVariations: variations => set({ variations }),
  addVariations: (newVariations: Variation[]) =>
    set({
      variations: [...get().variations, ...newVariations],
    }),
  reset: () => set({ render: null, variations: [] }),
}));
