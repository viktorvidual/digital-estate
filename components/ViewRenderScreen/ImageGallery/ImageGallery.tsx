import { MyText } from '@/components/shared';
import { useViewRenderStore } from '@/stores';
import { Variation } from '@/types';
import React, { forwardRef } from 'react';
import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import { getTokens, useMedia, View, YStack } from 'tamagui';
import { DownloadImageContainer } from './ImageGallery.styles';
import { Download } from '@tamagui/lucide-icons';
import { saveAs } from 'file-saver';

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
  dimensions: string;
};

export const ImageGallery = ({ images, dimensions }: Props) => {
  const { setCurrentIndex, variations, currentIndex } = useViewRenderStore();

  const item = variations[currentIndex];

  const [width, height] = dimensions.split('x');
  const imageRatio =
    typeof width === 'number' && typeof height === 'number' ? width / height : null;

  const onDownload = async () => {
    const imageUrl = item.url;
    const fileName = `${item.roomType}-${item.style}-${item.variationId}.jpg`;
    saveAs(imageUrl, fileName);
  };

  const media = useMedia();
  return (
    <View>
      <DownloadImageContainer cursor="pointer" onPress={onDownload}>
        <Download color="white" size={16} />
      </DownloadImageContainer>
      <ImageGalleryComponent
        showPlayButton={false}
        showFullscreenButton={false}
        items={images}
        onSlide={index => {
          setCurrentIndex(index);
        }}
        renderItem={item => renderItem(item as Image, !!media.lg, imageRatio)}
      />
    </View>
  );
};

const renderItem = (item: Image, mediaLg: boolean, imageRatio: number | null) => {
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
        <YStack width="100%" height={"100%"} alignItems="center" justifyContent="center" gap={'$4'}>
          <img
            src={item.renderUrl}
            alt=""
            style={{
              width: '100%',
              maxHeight: mediaLg ? 600 : undefined,
              borderRadius: getTokens().radius['$1'].val,
              objectFit: 'contain',
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
              width: '100%',
              maxHeight: mediaLg ? 600 : undefined,
              borderRadius: getTokens().radius['$1'].val,
              objectFit: 'contain',
              aspectRatio: imageRatio ?? 'auto',
            }}
          />
        </>
      )}
    </YStack>
  );
};
