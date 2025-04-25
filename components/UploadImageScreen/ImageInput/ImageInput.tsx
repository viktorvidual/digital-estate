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
import { saveTemporaryImage, generateMask } from '@/services';
import { useAuthStore, useUploadImageStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { MaskOverlayCanvas } from '../MaskOverlayCanvas/MaskOverlayCanvas';
import { useMedia } from 'tamagui';

export const ImageInput = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const media = useMedia();

  const { customer } = useAuthStore();

  const [imageWidthClient, setImageWidthClient] = React.useState(0);
  const [imageHeightClient, setImageHeightClient] = React.useState(0);

  const {
    imageDimensions,
    localImage,
    setLocalImage,
    maskedImageUrl,
    maskId,
    setMaskId,
    removeFurniture,
    setMaskedImageUrl,
    uploading,
    selectedFile,
    setSelectedFile,
    setImageDimensions,
    setUploading,
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
    setLocalImage('');
    setSelectedFile(null);
    setMaskedImageUrl('');
    setMaskId('');
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

      setUploading(true);
      const { error, data: temporaryUrl } = await saveTemporaryImage(
        customer?.userId,
        selectedFile
      );

      if (error || !temporaryUrl) {
        setUploading(false);
        return console.error(error || 'No temporary url response');
      }

      //Get The Masked Image
      const { error: generateMaskError, data: maskId } = await generateMask(
        temporaryUrl,
        customer.userId
      );

      if (generateMaskError || !maskId) {
        setUploading(false);
        return console.error(
          'generate mask error in image input',
          generateMaskError || 'no mask id return'
        );
      }

      setMaskId(maskId);
    })();
  }, [removeFurniture, selectedFile, customer?.userId]);

  useEffect(() => {
    if (!maskId || !removeFurniture) return;

    const channel = supabase
      .channel('mask-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'masks',
          filter: `mask_id=eq.${maskId}`,
        },
        payload => {
          const newMaskUrl = payload.new.url;
          if (newMaskUrl) {
            setMaskedImageUrl(newMaskUrl);
            setUploading(false);
          }
        }
      )
      .subscribe();

    return () => {
      setUploading(false);
      supabase.removeChannel(channel);
    };
  }, [maskId, removeFurniture]);

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
            onChange={pickImage}
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
          <DeleteImageContainer onPress={onDelete}>
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
