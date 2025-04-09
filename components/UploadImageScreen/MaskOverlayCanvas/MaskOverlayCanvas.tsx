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

    let cancelled = false;

    // Clear the canvas before repainting
    ctx.clearRect(0, 0, width, height);

    const mask = new Image();
    mask.crossOrigin = 'anonymous';

    mask.onload = () => {
      if (cancelled) return;

      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

      if (!maskCtx) return;

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
          overlay.data[i + 3] = 100; // Alpha
        }
      }

      ctx.putImageData(overlay, 0, 0);
    };

    mask.src = maskUrl;

    return () => {
      cancelled = true;
    };
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
