import { useAuthStore } from '@/stores';
import React, { useEffect, useState } from 'react';
import { getAllUserPhotos } from '@/services';
import { supabase } from '@/lib/supabase';
import { MyText } from '@/components/shared';
import { Spinner, XStack, useMedia } from 'tamagui';

export const PhotosList = () => {
  const media = useMedia();
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { customer } = useAuthStore();

  useEffect(() => {
    if (!customer) {
      return console.error('No customer');
    }

    (async () => {
      setIsLoading(true);
      const { error, data } = await getAllUserPhotos(customer.userId);

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
                  <React.Fragment key={el.id.toString()}>
                    <img
                      src={el.thumbnaiUrl}
                      style={{
                        width: media.lg ? '10%' : '31%',
                        aspectRatio: 1,
                        height: 'auto',
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    />
                  </React.Fragment>
                ))}
              </XStack>
            </>
          )}
        </>
      )}
    </>
  );
};
