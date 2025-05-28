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
import { useAuthStore, useUploadImageStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { MaskOverlayCanvas } from '../MaskOverlayCanvas/MaskOverlayCanvas';
import { useMedia } from 'tamagui';
import { useShowToast } from '@/hooks';

export const ImageInput = () => {
  const showToast = useShowToast();

  const imageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const media = useMedia();
  let maskListenderChannel: ReturnType<typeof supabase.channel> | null = null;

  const { customer } = useAuthStore();

  const [imageWidthClient, setImageWidthClient] = React.useState(0);
  const [imageHeightClient, setImageHeightClient] = React.useState(0);

  const {
    imageDimensions,
    localImage,
    maskedImageUrl,
    maskId,
    removeFurniture,
    uploading,
    selectedFile,
    pickImage,
    deleteImage,
    uploadImageForMask,
    subscribeToMaskUpdates,
    unsubscribeFromMaskUpdates,
  } = useUploadImageStore();

  /* The effect below generates masksID and creates mask row in the DB. After the mask is ready, a webhook hanlder updates the DB
  and the effect below listens for that update */
  useEffect(() => {
    uploadImageForMask(customer, showToast);
  }, [removeFurniture, selectedFile, customer?.userId]);

  useEffect(() => {
    //This effect triggers when maskID is avaible, right after the effect above has generated a maskID,
    // Here we listen to DB, when that mask table is updated with a URL of the mask image
    subscribeToMaskUpdates(maskListenderChannel);

    return () => {
      unsubscribeFromMaskUpdates(maskListenderChannel);
    };
  }, [maskId, removeFurniture]);

  // Effect to handle image loading and resizing
  useEffect(() => {
    if (!localImage || !imageRef.current) return;

    const img = imageRef.current;

    const handleImageLoad = () => {
      if (!imageRef.current) return;

      const ratio = imageDimensions.width / imageDimensions.height;
      let width = img.height * ratio;
      let height = img.height;

      if (width > img.width) {
        width = img.width;
        height = img.width / ratio;
      }

      setImageWidthClient(width);
      setImageHeightClient(height);
    };

    // Attach the load handler
    img.addEventListener('load', handleImageLoad);

    // If it's already loaded (from cache), fire manually
    if (img.complete) {
      handleImageLoad();
    }

    // Resize listener
    window.addEventListener('resize', handleImageLoad);

    return () => {
      img.removeEventListener('load', handleImageLoad);
      window.removeEventListener('resize', handleImageLoad);
    };
  }, [localImage, imageDimensions]);

  return (
    <View width={'100%'} $lg={{ width: '60%' }}>
      {!localImage && (
        <>
          <ImageInputContainer onPress={() => inputRef.current?.click()}>
            <Upload size={20} />
            <>
              <MyText fw="medium" size="$5">
                Kaчи Снимка
              </MyText>
            </>
          </ImageInputContainer>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={event => pickImage(customer, event, showToast, inputRef)}
            style={{
              display: 'none',
            }}
          />
        </>
      )}

      {localImage && (
        <YStack width={'100%'} bg="#f9f9f9" rounded={'$6'}>
          {uploading && (
            <ImageLoadingContainer gap="$3">
              <Spinner size="large" />
              <MyText color="white">Обработка...</MyText>
            </ImageLoadingContainer>
          )}
          <DeleteImageContainer onPress={deleteImage}>
            <Trash color="white" size={20} />
          </DeleteImageContainer>
          <img
            ref={imageRef}
            src={localImage}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: media.lg ? 600 : 350,
              display: 'block',
              borderRadius: 10,
              objectFit: 'contain',
            }}
          />
          {maskedImageUrl && removeFurniture && (
            <MaskOverlayCanvas
              maskUrl={maskedImageUrl}
              width={imageWidthClient}
              height={imageHeightClient}
            />
          )}
        </YStack>
      )}
    </View>
  );
};
