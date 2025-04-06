import React, { useState, useRef } from 'react';
import { useAuthStore, useUploadImageStore } from '@/stores';
import {
  ImageInputContainer,
  ImageLoadingContainer,
  DeleteImageContainer,
} from './ImageInput.styles';
import { Trash } from '@tamagui/lucide-icons';
import { Upload } from '@tamagui/lucide-icons';
import { MyText } from '@/components/shared';
import { Spinner, YStack } from 'tamagui';

export const ImageInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { customer } = useAuthStore();
  const { uploading, setSelectedFile, setImageDimensions } = useUploadImageStore();

  const [localImage, setLocalImage] = useState('');

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!customer) {
      return console.error('No customer. Please log out and log in again');
    }

    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLocalImage(previewUrl);

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  };

  return (
    <>
      {!localImage && (
        <>
          <ImageInputContainer onPress={() => inputRef.current?.click()}>
            <>
              <Upload size={20} />
              <MyText fw="medium" size="$5">
                Kaчи Снимка
              </MyText>
            </>
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
          {uploading && (
            <ImageLoadingContainer gap="$3">
              <Spinner size="large" />
              <MyText color="white">Обработка...</MyText>
            </ImageLoadingContainer>
          )}
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
    </>
  );
};
