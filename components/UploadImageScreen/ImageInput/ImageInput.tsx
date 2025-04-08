import React, { useRef, useEffect } from 'react';
import { Spinner, YStack, View } from 'tamagui';
import { MyText } from '@/components/shared';
import { Trash } from '@tamagui/lucide-icons';
import { Upload } from '@tamagui/lucide-icons';
import {
  ImageInputContainer,
  ImageLoadingContainer,
  DeleteImageContainer,
} from './ImageInput.styles';
import { saveTemporaryImage } from '@/services';
import { useAuthStore, useUploadImageStore } from '@/stores';

export const ImageInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { customer } = useAuthStore();

  const {
    localImage,
    setLocalImage,
    maskedImageUrl,
    removeFurniture,
    setMaskedImageUrl,
    uploading,
    selectedFile,
    setSelectedFile,
    setImageDimensions,
  } = useUploadImageStore();

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!customer) {
      return console.error('No customer. Please log out and log in again');
    }

    const file = event.target.files?.[0];

    if (!file) return;

    if (file.name === selectedFile?.name) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLocalImage(previewUrl);

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  };

  const onDelete = () => {
    setMaskedImageUrl('');
    setLocalImage('');
    setSelectedFile(null);
  };

  useEffect(() => {
    (async () => {
      if (!customer) {
        return console.error('No customer object does not exist.');
      } else if (!selectedFile) {
        return console.log('No selected file');
      } else if (!removeFurniture) {
        return console.log('Furniter will not be removed, no need to upload temporary image');
      }

      const { error, data: temporaryUrl } = await saveTemporaryImage(
        customer?.userId,
        selectedFile
      );

      if (error) {
        return console.error(error);
      }

      console.log('temporary image uploaded');

      //Get The Masked Image
    })();
  }, [removeFurniture, selectedFile, customer?.userId]);

  return (
    <View width={'100%'} $lg={{ width: '60%' }}>
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
          <DeleteImageContainer onPress={onDelete}>
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
    </View>
  );
};
