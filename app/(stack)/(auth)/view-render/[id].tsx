import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getRender, getRenderVariations } from '@/services';
import { Spinner, View, XStack, YStack, useMedia } from 'tamagui';
import { ROOM_TYPES, FURNITURE_STYLES } from '@/constants';
import { OriginalImage, ImageGallery } from '@/components/ViewRenderScreen';
import { supabase } from '@/lib/supabase';

import 'react-image-gallery/styles/css/image-gallery.css';
import '@/css/image-gallery-custom.css';

import { useViewRenderStore } from '@/stores';
import { Variation, VariationStatus } from '@/types';

export default function ViewRenderScreen() {
  const channelRef = useRef<any>(null);
  const [hasPending, setHasPending] = useState(false);

  const { id: renderId } = useLocalSearchParams();
  const media = useMedia();

  const {
    currentIndex,
    variations,
    render,
    loading,
    setLoading,
    setRoomType,
    setFurnitureStyle,
    setRender,
    setVariations,
    updateVariation,
  } = useViewRenderStore();

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
      variation: Variation;
      renderUrl?: string;
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        if (!render) {
          const { error, data } = await getRender(renderId as string);
          if (error || !data) {
            setLoading(false);
            return console.error(error || 'No render data in use effect');
          }
          setRender(data);
          return;
        }

        const { error: variationsError, data: variationsData } = await getRenderVariations(
          render.renderId as string
        );

        if (variationsError || !variationsData) {
          setLoading(false);
          return console.error(variationsError);
        }

        const roomType = ROOM_TYPES.find(el => el.value === variationsData[0].roomType) as {
          value: string;
          label: string;
        };

        const furnitureStyle = FURNITURE_STYLES.find(
          el => el.value === variationsData[0].style
        ) as { value: string; label: string };

        setRoomType(roomType);
        setFurnitureStyle(furnitureStyle);
        setVariations(variationsData);
        setLoading(false);
      })();
    }, [render])
  );

  useEffect(() => {
    const images = variations.map(el => ({
      original: el.url || 'https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif',
      thumbnail:
        el?.thumbnail || 'https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif',
      id: el.variationId,
      variation: el,
      renderUrl: render?.url,
    }));

    setImages([...images]);
  }, [variations]);

  useEffect(() => {
    const hasPending = variations.some(v => v.status === 'queued' || v.status === 'rendering');
    setHasPending(hasPending);
  }, [variations]);

  useEffect(() => {
    if (hasPending) {
      // Ensure an active subscription if not already present
      console.log('Setting up subscription for renderId:', renderId);

      if (!channelRef.current) {
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
              console.log('Received update for renderId:', renderId);
              
              const updated = payload.new;
              console.log('Updated variation:', updated);

              const thumbnail = supabase.storage.from('images').getPublicUrl(updated.file_path, {
                transform: {
                  width: 200,
                  height: 200,
                },
              });

              updateVariation({
                id: updated.id as string,
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
    } else if (!hasPending && channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [hasPending, renderId]);

  useEffect(() => {
    return () => {
      // Cleanup subscription on unmount
      console.log('Cleaning up subscription on unmount');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return (
    <MyYStack>
      <div
        style={{
          minHeight: '79vh',
        }}
      >
        {' '}
        {loading || !render ? (
          <View flex={1} items={'center'} justify={'center'} height={'40vh'}>
            <Spinner size="large" />
          </View>
        ) : (
          <>
            {media.lg ? (
              <XStack width={'100%'} gap="$4">
                <View width={'30%'}>
                  <OriginalImage />
                </View>

                <YStack width="70%" gap="$2">
                  <MyText ml="$1" fw="bold" size="$8">
                    {roomTypeVariation?.label}, {furnitureStyleIndexVariation?.label} стил
                  </MyText>
                  <ImageGallery images={images} dimensions={render.dimensions} />
                </YStack>
              </XStack>
            ) : (
              <YStack width={'100%'} gap="$4">
                <YStack width={'100%'} gap="$2">
                  <MyText ml="$1" fw="bold" size="$8">
                    Резултат ({roomTypeVariation?.label}, {furnitureStyleIndexVariation?.label}{' '}
                    стил)
                  </MyText>
                  <ImageGallery images={images} dimensions={render.dimensions} />
                </YStack>
                <OriginalImage />
              </YStack>
            )}
          </>
        )}
      </div>
    </MyYStack>
  );
}
