import { MyText } from '@/components/shared';
import { useViewRenderStore } from '@/stores';
import { Variation } from '@/types';
import React, { forwardRef, useRef } from 'react';
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
        renderItem={item => renderItem(item as Image, !!media.lg)}
        onSlide={index => {
          setCurrentIndex(index);
        }}
      />
    </View>
  );
};

const renderItem = (item: Image, mediaLg: boolean) => {
  const error = item.variation.status === 'error';
  return (
    <YStack
      px="15%"
      alignItems="center"
      alignSelf="center"
      justifyContent="center"
      overflow="hidden"
    >
      {error ? (
        <View height={mediaLg ? 600 : 300} width="100%" alignItems="center" justifyContent="center">
          <MyText fw="medium">Грешка при генериране на изображението.</MyText>

          <MyText>Моля, опитайте отново.</MyText>
        </View>
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
