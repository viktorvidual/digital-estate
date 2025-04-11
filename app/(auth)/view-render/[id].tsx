import React, { useEffect, useState } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { useLocalSearchParams } from 'expo-router';
import { getRender, getRenderVariations } from '@/services';
import { View, XStack, YStack, useMedia } from 'tamagui';
import { ROOM_TYPES, FURNITURE_STYLES } from '@/constants';
// import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import { OriginalImage, ImageGallery } from '@/components/ViewRenderScreen';

import 'react-image-gallery/styles/css/image-gallery.css';
import '@/css/image-gallery-custom.css';

import { useViewRenderStore } from '@/stores';

export default function ViewRenderScreen() {
  const { id } = useLocalSearchParams();
  const media = useMedia();

  const { currentIndex, variations, setRender, setVariations } = useViewRenderStore();

  const roomTypeVariation =
    variations.length > 0
      ? ROOM_TYPES.find(el => el.value === variations[currentIndex].roomType)
      : { value: '', label: '' };

  const furnitureStyleIndexVariation =
    variations.length > 0
      ? FURNITURE_STYLES.find(el => el.value === variations[currentIndex].style)
      : { value: '', label: '' };

  const [images, setImages] = useState<
    {
      original: string;
      thumbnail: string;
      id: string;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { error, data } = await getRender(id as string);

      if (error || !data) {
        return console.error(error || 'No render data in use effect');
      }

      setRender(data);

      const { error: variationsError, data: variationsData } = await getRenderVariations(
        id as string
      );

      if (variationsError || !variationsData) {
        return console.error(variationsError);
      }

      setVariations(variationsData);

      const images = variationsData.map(el => ({
        original: el.url,
        thumbnail: el.thumbnail,
        id: el.variationId,
      }));

      setImages(images);
    })();
  }, [id]);

  return (
    <MyYStack>
      {media.lg ? (
        <XStack width={'100%'} gap="$4">
          <View width={'30%'}>
            <OriginalImage />
          </View>

          <YStack width="70%" gap="$2">
            <MyText ml="$1" fw="bold" size="$8">
              Резултат ({roomTypeVariation?.label}, {furnitureStyleIndexVariation?.label} стил)
            </MyText>
            <ImageGallery images={images} />
          </YStack>
        </XStack>
      ) : (
        <YStack width={'100%'} gap="$4">
          <YStack width={'100%'} gap="$2">
            <MyText ml="$1" fw="bold" size="$8">
              Резултат ({roomTypeVariation?.label}, {furnitureStyleIndexVariation?.label} стил)
            </MyText>
            <ImageGallery images={images} />
          </YStack>
          <OriginalImage />
        </YStack>
      )}
    </MyYStack>
  );
}
