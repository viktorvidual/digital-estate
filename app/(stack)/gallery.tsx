import React, { useEffect, useState } from 'react';
import { MyText } from '@/components/shared';
import { YStack, styled, Button, XStack, Spinner, Text } from 'tamagui';
import { Image } from '@tamagui/lucide-icons';
import { supabase } from '@/lib/supabase';
import { GalleryPageContet } from '@/types';
import { useShowToast } from '@/hooks';

export default function ImageGalleryScreen() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pageContet, setPageContet] = useState<GalleryPageContet>();
  const roomTypes = pageContet?.roomTypes?.split(',') || [];

  const [selectedPage, setSelectedPage] = useState(roomTypes.length ? roomTypes[0] : 'хол');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { error, data } = await supabase.from('gallery-page').select('*');
      setIsLoading(false);

      if (error) {
        return showToast({
          title: error.name,
          description: error.message,
          type: 'error',
        });
      }

      setPageContet(data[0]);
    })();
  }, []);

  return (
    <GalleryContainer>
      {isLoading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <YStack justify={'center'} items={'center'}>
            <Image color="$green6" />
            <MyText color="white">{pageContet?.iconText}</MyText>
          </YStack>
          <MyText color="white" fw="bold" type="title">
            {pageContet?.hOne}
          </MyText>
          <MyText color="white" type="subtitle" textAlign="center">
            {pageContet?.hTwo}
          </MyText>

          <XStack>
            {roomTypes.map(type => {
              const isSelected = selectedPage === type;
              return (
                <RoomTypeButton isSelected={isSelected} onPress={() => setSelectedPage(type)}>
                  <RoomTypeButtonText focusable={false} isSelected={isSelected}>
                    {type}
                  </RoomTypeButtonText>
                </RoomTypeButton>
              );
            })}
          </XStack>
        </>
      )}
    </GalleryContainer>
  );
}

const GalleryContainer = styled(YStack, {
  name: 'GalleryContainer',
  gap: '$3',
  content: 'center',
  alignSelf: 'center',
  items: 'center',
  width: '100%',
  bg: '$blue12',
  py: '$5',
  $lg: {
    alignSelf: 'flex-start',
  },
});

const RoomTypeButton = styled(Button, {
  name: 'RoomTypeButton',
  size: '$2',
  bg: '$blue10',
  color: 'white',
  borderRadius: '$4',
  mr: '$2',
  p: '$5',

  variants: {
    isSelected: {
      true: {
        bg: 'white',
      },
    },
  } as const,
});

const RoomTypeButtonText = styled(Text, {
  color: 'white',
  fontWeight: 'bold',

  variants: {
    isSelected: {
      true: {
        color: '$blue12',
      },
    },
  },
} as const);
