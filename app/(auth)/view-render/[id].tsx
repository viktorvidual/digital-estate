import React, { useEffect, useState } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { useLocalSearchParams } from 'expo-router';
import { getRender, getRenderVariations } from '@/services';
import { Render } from '@/types';
import { View, XStack, YStack, useMedia } from 'tamagui';
import { RoomType, FurnitureStyle } from '@/constants';
// import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import { OriginalImage, ImageGallery } from '@/components/ViewRenderScreen';

import 'react-image-gallery/styles/css/image-gallery.css';
import '@/css/image-gallery-custom.css';

export default function ViewRenderScreen() {
  const [render, setRender] = useState<Render | null>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [images, setImages] = useState<
    {
      original: string;
      thumbnail: string;
      id: string;
    }[]
  >([]);
  const { id } = useLocalSearchParams();
  const [roomType, setRoomType] = useState<RoomType>({} as RoomType);
  const [furnitureStyle, setFurnitureStyle] = useState<FurnitureStyle>({} as FurnitureStyle);
  const media = useMedia();

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

      console.log(images);
    })();
  }, [id]);

  return (
    <MyYStack>
      {media.lg ? (
        <XStack width={'100%'} gap="$4">
          <View width={'30%'}>
            <OriginalImage
              render={render}
              roomType={roomType}
              furnitureStyle={furnitureStyle}
              setRoomType={setRoomType}
              setFurnitureStyle={setFurnitureStyle}
            />
          </View>

          <YStack width="70%" gap="$2">
            <MyText ml="$1" fw="bold" size="$8">
              Вариации
            </MyText>
            <ImageGallery images={images} />
          </YStack>
        </XStack>
      ) : (
        <YStack width={'100%'} gap="$4">
          <YStack width={'100%'} gap="$2">
            <MyText ml="$1" fw="bold" size="$8">
              Вариации
            </MyText>
            <ImageGallery images={images} />
          </YStack>
          <OriginalImage
            render={render}
            roomType={roomType}
            furnitureStyle={furnitureStyle}
            setRoomType={setRoomType}
            setFurnitureStyle={setFurnitureStyle}
          />
        </YStack>
      )}
    </MyYStack>
  );
}
