import { create } from 'zustand';

type Render = {
  renderId: string;
  url: string;
  filePath: string;
  userId: string;
  dimensions: string;
};

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
