export const dataURLToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

export const generateBlackAndWhiteMaskBinary = (canvas: HTMLCanvasElement): string | null => {

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // Create a new imageData for the binary mask
  const binaryMask = ctx.createImageData(width, height);

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    const color = alpha > 0 ? 255 : 0;

    binaryMask.data[i] = color; // R
    binaryMask.data[i + 1] = color; // G
    binaryMask.data[i + 2] = color; // B
    binaryMask.data[i + 3] = 255; // Full opacity
  }

  // Create a temporary canvas to convert to an image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return null;

  tempCtx.putImageData(binaryMask, 0, 0);
  return tempCanvas.toDataURL('image/png');
};
