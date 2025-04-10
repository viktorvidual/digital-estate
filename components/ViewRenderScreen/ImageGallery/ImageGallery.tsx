import React, { forwardRef } from 'react';
import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import { getTokens, useMedia, View, YStack } from 'tamagui';

const ImageGalleryComponent = forwardRef<HTMLDivElement, ReactImageGalleryProps>((props, ref) => {
  return <ReactImageGallery ref={ref} {...props} />;
});

type Props = {
  images: {
    original: string;
    thumbnail: string;
    id: string;
  }[];
};

export const ImageGallery = ({ images }: Props) => {
  const media = useMedia();
  return (
    <View>
      <ImageGalleryComponent
        showPlayButton={false}
        showFullscreenButton={false}
        items={images}
        renderItem={item => renderItem(item, !!media.lg)}
      />
    </View>
  );
};

const renderItem = (item: { original: string }, mediaLg: boolean) => {
  return (
    <YStack width="100%" alignItems="center" justifyContent="center" overflow="hidden">
      <img
        src={item.original}
        alt=""
        style={{
          maxHeight: mediaLg ? 600 : 300,
          borderRadius: getTokens().radius['$1'].val,
          objectFit: 'fill',
        }}
      />
    </YStack>
  );
};
