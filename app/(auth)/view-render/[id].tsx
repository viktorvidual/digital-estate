import React, { useEffect, useRef, useState } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { useLocalSearchParams } from 'expo-router';
import { getRender, getRenderVariations } from '@/services';
import { View, XStack, YStack, useMedia } from 'tamagui';
import { ROOM_TYPES, FURNITURE_STYLES } from '@/constants';
import { OriginalImage, ImageGallery } from '@/components/ViewRenderScreen';
import { supabase } from '@/lib/supabase';

import 'react-image-gallery/styles/css/image-gallery.css';
import '@/css/image-gallery-custom.css';

import { useViewRenderStore } from '@/stores';
import { VariationStatus } from '@/types';

export default function ViewRenderScreen() {
  const channelRef = useRef<any>(null);

  const { id: renderId } = useLocalSearchParams();
  const media = useMedia();

  const { currentIndex, variations, setRender, setVariations, updateVariation } =
    useViewRenderStore();

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
      if (!renderId) return;
      const { error, data } = await getRender(renderId as string);

      if (error || !data) {
        return console.error(error || 'No render data in use effect');
      }

      setRender(data);

      const { error: variationsError, data: variationsData } = await getRenderVariations(
        renderId as string
      );

      if (variationsError || !variationsData) {
        return console.error(variationsError);
      }

      setVariations(variationsData);
    })();
  }, [renderId]);

  useEffect(() => {
    const images = variations.map(el => ({
      original: el.url || 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif',
      thumbnail:
        el?.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif',
      id: el.variationId,
    }));

    setImages([...images]);
  }, [variations]);

  useEffect(() => {
    const hasPending = variations.some(v => v.status === 'queued' || v.status === 'rendering');

    if (hasPending && !channelRef.current) {
      // Subscribe to variations for this render
      channelRef.current = supabase
        .channel(`variations-${renderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'variations',
            filter: `render_id=eq.${renderId}`,
          },
          payload => {
            const updated = payload.new;
            const thumbnail = supabase.storage.from('images').getPublicUrl(updated.file_path, {
              transform: {
                width: 200,
                height: 200,
              },
            });

            updateVariation({
              status: updated.status as VariationStatus,
              url: updated.url as string,
              filePath: updated.file_path as string,
              variationId: updated.variation_id as string,
              baseVariationId: updated.base_variation_id as string,
              roomType: updated.room_type as string,
              style: updated.style as string,
              thumbnail: thumbnail.data.publicUrl,
              renderId: updated.render_id as string,
            });
          }
        )
        .subscribe();
    }

    // Cleanup when no more pending
    if (!hasPending && channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Optional cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [variations, renderId]);

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
