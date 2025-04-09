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

export const ImageInput = () => {
  const prevFileSelected = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { customer } = useAuthStore();

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
    uploadingMessage,
    setUploadingMessage,
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

      if (prevFileSelected?.current && prevFileSelected?.current.name === selectedFile.name) {
        console.log('mask for this file has been already generated');
        return;
      }

      setUploading(true);
      setUploadingMessage('Анализираме на снимката...');
      const { error, data: temporaryUrl } = await saveTemporaryImage(
        customer?.userId,
        selectedFile
      );

      if (error || !temporaryUrl) {
        console.log('stopping loading 1');

        setUploading(false);
        return console.error(error || 'No temporary url response');
      }

      //Get The Masked Image
      const { error: generateMaskError, data: maskId } = await generateMask(
        temporaryUrl,
        customer.userId
      );

      if (generateMaskError || !maskId) {
        console.log('stopping loading 2');

        setUploading(false);
        return console.error(
          'generate mask error in image input',
          generateMaskError || 'no mask id return'
        );
      }

      setMaskId(maskId);
      prevFileSelected.current = selectedFile;
    })();
  }, [removeFurniture, selectedFile, customer?.userId]);

  useEffect(() => {
    if (!maskId) return;

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
            console.log('stopping loading 3');

            console.log('Mask updated! New URL:', newMaskUrl);
            setTimeout(() => {
              setUploading(false);
            }, 500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [maskId]);

  useEffect(() => {
    console.log(uploading);
  }, [uploading]);

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
        <YStack width={'100%'}>
          {uploading && (
            <ImageLoadingContainer gap="$3">
              <Spinner size="large" />
              <MyText color="white">{uploadingMessage}</MyText>
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
          {maskedImageUrl && removeFurniture && !uploading && (
            <MaskOverlayCanvas
              maskUrl={maskedImageUrl}
              width={imageDimensions.width}
              height={imageDimensions.height}
            />
          )}
        </YStack>
      )}
    </View>
  );
};
