import { MyText } from '@/components/shared';
import { useViewRenderStore } from '@/stores';
import { Variation } from '@/types';
import React, { forwardRef } from 'react';
import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import { getTokens, useMedia, View, YStack } from 'tamagui';

const ImageGalleryComponent = forwardRef<HTMLDivElement, ReactImageGalleryProps>((props, ref) => {
  return <ReactImageGallery ref={ref} {...props} />;
});

type Image = {
  original: string;
  thumbnail: string;
  id: string;
  variation: Variation;
  renderUrl?: string;
};

type Props = {
  images: Image[];
};

export const ImageGallery = ({ images }: Props) => {
  const { setCurrentIndex } = useViewRenderStore();

  const media = useMedia();
  return (
    <View>
      <ImageGalleryComponent
        showPlayButton={false}
        showFullscreenButton={false}
        items={images}
        onSlide={index => {
          setCurrentIndex(index);
        }}
        renderItem={item => renderItem(item as Image, !!media.lg)}
      />
    </View>
  );
};

const renderItem = (item: Image, mediaLg: boolean) => {
  return (
    <YStack alignItems="center" alignSelf="center" justifyContent="center" overflow="hidden">
      {item.variation.status === 'error' ? (
        <View
          height={mediaLg ? 600 : 300}
          px="15%"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <MyText fw="medium">Грешка при генериране на изображението.</MyText>
          <MyText>Моля, опитайте отново.</MyText>
        </View>
      ) : item.variation.status === 'queued' ? (
        <YStack
          height={mediaLg ? 600 : 300}
          width="100%"
          alignItems="center"
          justifyContent="center"
          gap={'$4'}
        >
          <img
            src={item.renderUrl}
            alt=""
            style={{
              maxHeight: mediaLg ? 600 : 300,
              borderRadius: getTokens().radius['$1'].val,
              objectFit: 'fill',
            }}
          />
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            bg="black"
            opacity={0.7}
            px="15%"
          >
            <MyText fw="bold" size="$8" color="white">
              Изображението се Генерира...
            </MyText>
          </View>
        </YStack>
      ) : (
        <>
          <img
            src={item.original}
            alt=""
            style={{
              maxHeight: mediaLg ? 600 : 300,
              borderRadius: getTokens().radius['$1'].val,
              objectFit: 'fill',
            }}
          />
        </>
      )}
    </YStack>
  );
};
