export type VariationStatus = 'done' | 'queued' | 'rendering' | 'error';

export type Variation = {
  renderId: string;
  variationId: string;
  status: VariationStatus;
  baseVariationId: string;
  filePath: string;
  url: string;
  thumbnail: string;
  roomType: string;
  style: string;
};
