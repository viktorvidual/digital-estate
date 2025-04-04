import React, { useState, useRef } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { ImageInputContainer, DeleteImageContainer } from '@/components/UploadImageScreen';
import { Upload } from '@tamagui/lucide-icons';
import { Button, YStack } from 'tamagui';
import { Trash } from '@tamagui/lucide-icons';

export default function UploadImageScreen() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [localImage, setLocalImage] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalImage(previewUrl);

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  };

  return (
    <MyYStack>
      {!localImage && (
        <>
          <ImageInputContainer onPress={() => inputRef.current?.click()}>
            <Upload size={20} />
            <MyText fw="medium" size="$5">
              Kaчи Снимка
            </MyText>
          </ImageInputContainer>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={pickImage}
            style={{
              display: 'none',
            }}
          />
        </>
      )}

      {localImage && (
        <YStack width={'100%'}>
          <DeleteImageContainer onPress={() => setLocalImage('')}>
            <Trash color="white" size={20} />
          </DeleteImageContainer>
          <img
            src={localImage}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: 10,
            }}
          />
        </YStack>
      )}
      <Button bg="$blue10">
        <MyText fw="bold" color="white">Обработи Снимката</MyText>
      </Button>
    </MyYStack>
  );
}
