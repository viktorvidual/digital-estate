import React, { useEffect, useRef, useState } from 'react';
import { View } from 'tamagui';

type Props = {
  maskUrl: string;
  width: number;
  height: number;
};

export const MaskOverlayCanvas = ({ maskUrl, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskDataRef = useRef<ImageData | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const paintedPixels = useRef<Set<string>>(new Set());

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

  // 🖌️ Painting Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !width || !height) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paint = (x: number, y: number) => {
      const maskData = maskDataRef.current;
      if (!maskData) return;

      const px = Math.floor(x);
      const py = Math.floor(y);
      const key = `${px},${py}`;

      // Skip if already painted
      if (paintedPixels.current.has(key)) return;

      const index = (py * width + px) * 4;
      const r = maskData.data[index];
      const g = maskData.data[index + 1];
      const b = maskData.data[index + 2];
      const isWhite = r > 200 && g > 200 && b > 200;

      if (!isWhite) {
        paintedPixels.current.add(key);

        ctx.fillStyle = 'rgba(254, 0, 50, 0.392)'; // match the alpha used in initial overlay
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const getPointerPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsPainting(true);
      const { x, y } = getPointerPos(e);
      paint(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isPainting) return;
      const { x, y } = getPointerPos(e);
      paint(x, y);
    };

    const handleEnd = () => {
      setIsPainting(false);
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [isPainting, width, height]);

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
          touchAction: 'none',
        }}
      />
    </View>
  );
};
