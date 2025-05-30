import React, { useEffect, useRef } from 'react';
import { View } from 'tamagui';

type Props = {
  maskUrl: string;
  width: number;
  height: number;
  paintMode?: boolean;
  eraseMode?: boolean;
  setMaskIsInProgress: (maskIsInProgress: boolean) => void;
};

export const MaskOverlayCanvas = ({
  maskUrl,
  width,
  height,
  paintMode,
  eraseMode,
  setMaskIsInProgress,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskDataRef = useRef<ImageData | null>(null);

  const isErasing = useRef(false);
  const isPainting = useRef(false);

  useEffect(() => {
    if (!width || !height) return;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

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
      maskDataRef.current = maskData;

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
          overlay.data[i + 3] = 120;
        }
      }

      ctx.putImageData(overlay, 0, 0);
    };

    mask.src = maskUrl;

    return () => {
      cancelled = true;
    };
  }, [maskUrl, width, height]);

  //Eraser Methods
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Only respond to left-click

    if (eraseMode) {
      isErasing.current = true;
      eraseAt(e);
      setMaskIsInProgress(true);
    }

    if (paintMode) {
      isPainting.current = true;
      paintAt(e);
      setMaskIsInProgress(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!(e.buttons & 1)) return; // Only proceed if left button is held

    if (isErasing.current) eraseAt(e);
    if (isPainting.current) paintAt(e);
  };

  const handleMouseUp = () => {
    if (eraseMode) {
      isErasing.current = false;
      setMaskIsInProgress(false);
    }
    if (paintMode) {
      isPainting.current = false;
      setMaskIsInProgress(false);
    }
  };

  const eraseAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !maskDataRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius = 10; // Eraser size
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width } = imageData;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = Math.floor(x + dx);
        const py = Math.floor(y + dy);
        if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;

        const distance = dx * dx + dy * dy;
        if (distance > radius * radius) continue;

        const i = (py * width + px) * 4;
        data[i + 3] = 0; // Clear alpha (make pixel fully transparent)
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const paintAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('painting');

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const maskData = maskDataRef.current;
    if (!canvas || !ctx || !maskData) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius = 10; // Brush size
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width } = imageData;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = Math.floor(x + dx);
        const py = Math.floor(y + dy);
        if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;

        const distance = dx * dx + dy * dy;
        if (distance > radius * radius) continue;

        const i = (py * width + px) * 4;

        data[i] = 254; // R
        data[i + 1] = 0; // G
        data[i + 2] = 50; // B
        data[i + 3] = 120; // Alpha (semi-transparent)
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <View
      style={{
        position: 'absolute',
        alignSelf: 'center',
        cursor: paintMode || eraseMode ? 'pointer' : 'default',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </View>
  );
};
