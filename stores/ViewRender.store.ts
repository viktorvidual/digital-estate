import { create } from 'zustand';
import { Render, Variation } from '@/types';
import { FurnitureStyle, RoomType } from '@/constants';

type ViewRenderStore = {
  loading: boolean;
  render: Render | null;
  variations: Variation[];
  roomType: RoomType;
  furnitureStyle: FurnitureStyle;
  currentIndex: number;
  setLoading: (loading: boolean) => void;
  updateVariation: (variation: Variation) => void;
  setCurrentIndex: (index: number) => void;
  addVariations: (variations: Variation[]) => void;
  setRoomType: (roomType: RoomType) => void;
  setFurnitureStyle: (furnitureStyle: FurnitureStyle) => void;
  setRender: (render: Render) => void;
  setVariations: (variations: Variation[]) => void;
  reset: () => void;
};

const baseState = {
  loading: false,
  render: null,
  roomType: {} as RoomType,
  furnitureStyle: {} as FurnitureStyle,
  variations: [],
  currentIndex: 0,
};

export const useViewRenderStore = create<ViewRenderStore>((set, get) => ({
  ...baseState,
  updateVariation: variantion => {
    set(state => ({
      variations: state.variations.map(el =>
        el.variationId === variantion.variationId ? variantion : { ...el }
      ),
    }));
  },
  setLoading: loading => set({ loading }),
  setCurrentIndex: index => set({ currentIndex: index }),
  setRoomType: roomType => set({ roomType }),
  setFurnitureStyle: furnitureStyle => set({ furnitureStyle }),
  setRender: render => set({ render }),
  setVariations: variations => set({ variations }),
  addVariations: (newVariations: Variation[]) =>
    set({
      variations: [...newVariations, ...get().variations],
    }),
  reset: () => set({ ...baseState }),
}));
