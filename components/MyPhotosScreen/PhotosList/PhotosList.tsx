import { useAuthStore } from '@/stores';
import React, { useEffect, useState } from 'react';
import { getAllRenders } from '@/services';
import { supabase } from '@/lib/supabase';
import { MyText } from '@/components/shared';
import { Spinner, View, XStack, useMedia } from 'tamagui';
import { Render } from '@/types';
import { router } from 'expo-router';
import { useViewRenderStore, usePhotosListStore } from '@/stores';

export const PhotosList = () => {
  const { reset, setRender } = useViewRenderStore();
  const { renders, setRenders } = usePhotosListStore();
  const media = useMedia();
  const [isLoading, setIsLoading] = useState(false);
  const { customer } = useAuthStore();

  const onPressPhoto = (render: Render) => {
    reset();
    setRender(render);
    router.navigate(`/view-render/${render.renderId}`);
  };

  useEffect(() => {
    if (!customer) {
      return console.error('No customer');
    }

    (async () => {
      setIsLoading(true);
      const { error, data } = await getAllRenders(customer.userId);

      if (error) {
        console.error(error);
      }

      const thumbnailedRenders = data?.map(el => {
        const thumbnailUrl = supabase.storage.from('images').getPublicUrl(el.filePath, {
          transform: {
            width: 200,
            height: 200,
          },
        });

        return {
          ...el,
          thumbnaiUrl: thumbnailUrl.data.publicUrl,
        };
      });

      if (thumbnailedRenders) {
        setRenders(thumbnailedRenders);
      }
      setIsLoading(false);
    })();
  }, [customer]);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {renders.length === 0 ? (
            <MyText>Все още нямате качени снимки</MyText>
          ) : (
            <>
              <XStack flexWrap="wrap" gap="$2">
                {renders.map(el => (
                  <View
                    cursor="pointer"
                    key={el.renderId}
                    onPress={() => onPressPhoto(el)}
                    width={media.lg ? '10%' : '31%'}
                  >
                    <img
                      src={el?.thumbnaiUrl ?? ''}
                      style={{
                        width: '100%',
                        aspectRatio: 1,
                        height: 'auto',
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    />
                  </View>
                ))}
              </XStack>
            </>
          )}
        </>
      )}
    </>
  );
};
