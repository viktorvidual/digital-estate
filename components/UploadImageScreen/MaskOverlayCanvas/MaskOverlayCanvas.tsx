import React, { useEffect, useRef } from 'react';

type Props = {
  maskUrl: string;
  width: number;
  height: number;
};

export const MaskOverlayCanvas = ({ maskUrl, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mask = new Image();

    mask.crossOrigin = 'anonymous';

    mask.src = maskUrl;

    Promise.all([new Promise(res => (mask.onload = res))]).then(() => {
      // Draw original image

      // Create offscreen canvas to get mask pixels
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d');

      if (maskCtx) {
        maskCtx.drawImage(mask, 0, 0, width, height);

        const maskData = maskCtx.getImageData(0, 0, width, height);
        const overlay = ctx.getImageData(0, 0, width, height);

        for (let i = 0; i < maskData.data.length; i += 4) {
          const r = maskData.data[i];
          const g = maskData.data[i + 1];
          const b = maskData.data[i + 2];

          const isWhite = r > 200 && g > 200 && b > 200;

          if (isWhite) {
            overlay.data[i] = 254; // Red
            overlay.data[i + 1] = 0; // Green
            overlay.data[i + 2] = 50; // Blue
            overlay.data[i + 3] = 100; // Alpha (out of 255) → ~40% opacity
          } else {
            // Leave the original image pixel unchanged
          }
        }

        ctx.putImageData(overlay, 0, 0);
      }
    });
  }, [maskUrl, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        borderRadius: 10,
        opacity: 0.8,
        position: 'absolute',
        width: '100%',
      }}
    />
  );
};

export default MaskOverlayCanvas;
