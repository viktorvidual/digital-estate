import React, { useEffect, useState, forwardRef } from 'react';
import type { ComponentType } from 'react';
import { MyText, MyYStack, NewSelect } from '@/components/shared';
import { useLocalSearchParams } from 'expo-router';
import { getRender, getRenderVariations } from '@/services';
import { Render } from '@/types';
import { getTokens, XStack, YStack, Button } from 'tamagui';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';
import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ImageGallery = forwardRef<HTMLDivElement, ReactImageGalleryProps>((props, ref) => {
  return <ReactImageGallery ref={ref} {...props} />;
});

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

  const tokens = getTokens();
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
      <XStack width={'100%'}>
        <YStack gap="$2" width={'30%'}>
          <MyText ml="$1" fw="bold" size="$8">
            Оригинал
          </MyText>
          <img
            src={render?.url}
            alt="Render"
            style={{ width: '100%', height: 'auto', borderRadius: tokens.radius['$6'].val }}
          />
          <MyText fw="bold">Вид Стая</MyText>
          <NewSelect
            placeholder="Избери вид стая"
            options={ROOM_TYPES}
            onChange={select => {
              setRoomType(select[0] as RoomType);
            }}
            values={[roomType]}
            searchable={false}
            setValue={setRoomType}
          />
          <MyText fw="bold">Стил Обзавеждане</MyText>
          <NewSelect
            placeholder="Избери стил"
            options={FURNITURE_STYLES}
            onChange={select => {
              setFurnitureStyle(select[0] as FurnitureStyle);
            }}
            values={[furnitureStyle]}
            searchable={false}
            setValue={setFurnitureStyle}
          />
          <Button bg="$blue10" mt="$1">
            <MyText color="white" fw="bold">
              Генерирай Още
            </MyText>
          </Button>
        </YStack>

        <YStack width={'70%'}>
          <MyText ml="$1" fw="bold" size="$8">
            Вариации
          </MyText>
          <ImageGallery items={images} renderItem={renderItem} />
        </YStack>
      </XStack>
    </MyYStack>
  );
}

const renderItem = (item: { original: string }) => (
  <YStack
    width="100%"
    alignItems="center"
    justifyContent="center"
    p="$2"
    rounded="$6"
    bg="$background"
    overflow="hidden"
  >
    <img
      src={item.original}
      alt=""
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: getTokens().radius['$6'].val,
        objectFit: 'contain',
      }}
    />
  </YStack>
);
