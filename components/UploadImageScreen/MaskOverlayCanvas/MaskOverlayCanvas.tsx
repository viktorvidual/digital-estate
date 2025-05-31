import { useUploadImageStore } from '@/stores';
import React, { useEffect, useRef } from 'react';
import { View } from 'tamagui';

type Props = {
  width: number;
  height: number;
};
export const MaskOverlayCanvas = ({ width, height }: Props) => {
  const {
    canvasRef,
    paintMode,
    eraseMode,
    maskedImageUrl,
    setMaskHasBeenEdited,
    setMaskEditInProgress,
  } = useUploadImageStore();

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

    mask.src = maskedImageUrl;

    return () => {
      cancelled = true;
    };
  }, [maskedImageUrl, width, height]);

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    if (eraseMode || paintMode) {
      setMaskHasBeenEdited(true);
      setMaskEditInProgress(true);
    }

    if (eraseMode) {
      isErasing.current = true;
      eraseAt(x, y);
    }

    if (paintMode) {
      isPainting.current = true;
      paintAt(x, y);
    }
  };

  const handlePointerMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    if (isErasing.current) eraseAt(x, y);
    if (isPainting.current) paintAt(x, y);
  };

  const handlePointerUp = () => {
    isErasing.current = false;
    isPainting.current = false;
    setMaskEditInProgress(false);
  };

  const paintAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const maskData = maskDataRef.current;
    if (!canvas || !ctx || !maskData) return;

    const radius = 10;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width } = imageData;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = Math.floor(x + dx);
        const py = Math.floor(y + dy);
        if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;
        if (dx * dx + dy * dy > radius * radius) continue;

        const i = (py * width + px) * 4;
        data[i] = 254;
        data[i + 1] = 0;
        data[i + 2] = 50;
        data[i + 3] = 120;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const eraseAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !maskDataRef.current) return;

    const radius = 10;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width } = imageData;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = Math.floor(x + dx);
        const py = Math.floor(y + dy);
        if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;
        if (dx * dx + dy * dy > radius * radius) continue;

        const i = (py * width + px) * 4;
        data[i + 3] = 0;
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
        borderRadius: 10,
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      />
    </View>
  );
};
