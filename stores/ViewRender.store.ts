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
  addVirtuallyStagedWatermark: boolean;

  setLoading: (loading: boolean) => void;
  updateVariation: (variation: Variation) => void;
  setCurrentIndex: (index: number) => void;
  addVariations: (variations: Variation[]) => void;
  setRoomType: (roomType: RoomType) => void;
  setFurnitureStyle: (furnitureStyle: FurnitureStyle) => void;
  setRender: (render: Render) => void;
  setVariations: (variations: Variation[]) => void;
  setAddVirtuallyStagedWatermark: (addVirtuallyStageWatermark: boolean) => void;
  reset: () => void;
};

const baseState = {
  loading: false,
  render: null,
  roomType: {} as RoomType,
  furnitureStyle: {} as FurnitureStyle,
  variations: [],
  currentIndex: 0,
  addVirtuallyStagedWatermark: false,
};

export const useViewRenderStore = create<ViewRenderStore>((set, get) => ({
  ...baseState,
  updateVariation: variantion => {
    set(state => ({
      variations: state.variations.map(el =>
        el.id === variantion.id ? variantion : { ...el }
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
  setAddVirtuallyStagedWatermark: addVirtuallyStagedWatermark =>
    set({ addVirtuallyStagedWatermark }),
  reset: () => set({ ...baseState }),
}));
