import React, { useEffect, useRef } from 'react';
import { View } from 'tamagui';

type Props = {
  maskUrl: string;
  width: number;
  height: number;
};

export const MaskOverlayCanvas = ({ maskUrl, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!width || !height) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    // Load the mask image
    const mask = new Image();
    mask.crossOrigin = 'anonymous';

    mask.onload = () => {
      if (cancelled) return;

      ctx.clearRect(0, 0, width, height);

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
          overlay.data[i] = 254;
          overlay.data[i + 1] = 0;
          overlay.data[i + 2] = 50;
          overlay.data[i + 3] = 100;
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
    <View
      style={{
        position: 'absolute',
        alignSelf: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          borderRadius: 10,
          touchAction: 'none', // important to prevent touch gestures
        }}
      />
    </View>
  );
};
