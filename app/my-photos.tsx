import React from 'react';
import { MyYStack, MyText } from '@/components/shared';
import { View, XStack, YStack, useMedia } from 'tamagui';
import { UploadImageButton, PhotosList } from '@/components/MyPhotosScreen';

export default function MyPhotos() {
  const media = useMedia();

  return (
    <MyYStack>
      <YStack width={'100%'} bg="#F9FAFB" rounded={'$6'} p={'$4'} gap="$3">
        {media.lg ? (
          <XStack width={'100%'} justify={'space-between'}>
            <MyText size="$9" fw="bold">
              Моите Снимки
            </MyText>
            <UploadImageButton />
          </XStack>
        ) : (
          <>
            <MyText size="$9" fw="bold" >
              Моите Снимки
            </MyText>

            <UploadImageButton />
          </>
        )}
        <PhotosList />
      </YStack>
    </MyYStack>
  );
}
