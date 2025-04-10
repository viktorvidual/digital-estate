import { useAuthStore } from '@/stores';
import React, { useEffect, useState } from 'react';
import { getUserPhotosPaths } from '@/services';
import { supabase } from '@/lib/supabase';
import { MyText } from '@/components/shared';
import { Spinner, View, XStack, useMedia } from 'tamagui';
import { Render } from '@/types';
import { router } from 'expo-router';

export const PhotosList = () => {
  const media = useMedia();
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { customer } = useAuthStore();

  const onPressPhoto = (photo: Render) => {
    router.navigate(`/view-render/${photo.renderId}`);
  };

  useEffect(() => {
    if (!customer) {
      return console.error('No customer');
    }

    (async () => {
      setIsLoading(true);
      const { error, data } = await getUserPhotosPaths(customer.userId);

      if (error) {
        console.error(error);
      }

      const thumbnails = data?.map(el => {
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

      if (thumbnails) {
        setPhotos(thumbnails);
      }
      setIsLoading(false);
    })();
  }, [customer]);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {photos.length === 0 ? (
            <MyText>Все още нямате качени снимки</MyText>
          ) : (
            <>
              <XStack flexWrap="wrap" gap="$2">
                {photos.map(el => (
                  <View
                    cursor="pointer"
                    key={el.renderId}
                    onPress={() => onPressPhoto(el)}
                    width={media.lg ? '10%' : '31%'}
                  >
                    <img
                      src={el.thumbnaiUrl}
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
