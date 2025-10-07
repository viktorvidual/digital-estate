'use-server';

import React, { useEffect, useState, forwardRef, useRef } from 'react';
import { MyText, MyYStack, Button, FullScreenLoader, AlertButton } from '@/components/shared';
import { YStack, XStack, Spinner } from 'tamagui';
import { Image, Upload } from '@tamagui/lucide-icons';
import { supabase } from '@/lib/supabase';
import { GalleryPageContet } from '@/types';
import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import { useShowToast } from '@/hooks';
import { useAuthStore } from '@/stores';
import { router } from 'expo-router';
import {
  HeaderContainer,
  RoomTypeButton,
  RoomTypeButtonText,
  ImageGalleryContainer,
} from '@/components/GalleryScreen';

const ImageGalleryComponent = forwardRef<ReactImageGallery, ReactImageGalleryProps>(
  (props, ref) => {
    return <ReactImageGallery ref={ref} {...props} />;
  }
);

// Add interface for grouped images
type GroupedImages = {
  name: string;
  url: string;
  roomType: string;
}[];

export default function ImageGalleryScreen() {
  const { customer } = useAuthStore();
  const galleryRef = useRef<ReactImageGallery>(null);

  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pageContet, setPageContet] = useState<GalleryPageContet>();
  const [selectedRoom, setSelectedRoom] = useState('living-room'); // Default selected room
  const [allImages, setAllImages] = useState<GroupedImages>([]);

  const roomTypes = pageContet?.roomTypes?.length
    ? pageContet.roomTypes.split(',')?.map(room => {
        const [label, id] = room.split(':');
        return {
          label,
          id,
        };
      })
    : [];

  const handleButtonPress = () => {
    if (customer?.stripeSubscriptionStatus === 'active') {
      router.navigate('/upload-image');
    } else {
      router.navigate('/pricing');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Fetch page content
        const { error, data } = await supabase.from('gallery-page').select('*');

        if (error) {
          showToast({
            title: error.name,
            description: error.message,
            type: 'error',
          });
          return;
        }

        const pageData = data[0];
        setPageContet(pageData);

        // Extract room IDs and fetch images
        if (pageData?.roomTypes) {
          const roomIds = pageData.roomTypes.split(',').map((room: string) => {
            const [label, id] = room.split(':');
            return id;
          });

          const images = await fetchAllImages(roomIds);
          console.log('Fetched grouped images:', images);
          setAllImages(images);
        }
      } catch (error) {
        showToast({
          title: 'Error',
          description: 'Failed to fetch gallery data',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {isLoading ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <HeaderContainer>
            <YStack justify={'center'} items={'center'}>
              <Image color="$green6" />
              <MyText color="white">{pageContet?.iconText}</MyText>
            </YStack>
            <MyText color="white" fw="bold" type="title" textAlign="center">
              {pageContet?.hOne}
            </MyText>
            <MyText color="white" type="subtitle" textAlign="center">
              {pageContet?.hTwo}
            </MyText>

            <XStack>
              {roomTypes.map(room => {
                const isSelected = selectedRoom === room.id;
                return (
                  <RoomTypeButton
                    key={room.id}
                    isSelected={isSelected}
                    onPress={() => {
                      setSelectedRoom(room.id);
                      const firstImageIndex = allImages.findIndex(img => img.roomType === room.id);
                      if (firstImageIndex !== -1 && galleryRef.current) {
                        galleryRef.current.slideToIndex(firstImageIndex);
                      }
                    }}
                  >
                    <RoomTypeButtonText isSelected={isSelected}>{room.label}</RoomTypeButtonText>
                  </RoomTypeButton>
                );
              })}
            </XStack>
          </HeaderContainer>
          <MyYStack justify="center" alignItems="center" mt={-150}>
            <ImageGalleryContainer>
              {allImages.length === 0 ? (
                <YStack
                  width="100%"
                  height="100%"
                  justify="center"
                  alignItems="center"
                  backgroundColor="$background"
                  borderRadius="$4"
                >
                  <Spinner size="large" />
                  <MyText mt="$4">Loading gallery...</MyText>
                </YStack>
              ) : (
                <ImageGalleryComponent
                  ref={galleryRef}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  lazyLoad={true}
                  showBullets={true}
                  showThumbnails={true}
                  additionalClass="custom-gallery"
                  items={allImages.map(img => ({
                    original: img.url,
                    thumbnail: img.url,
                  }))}
                  onSlide={index => {
                    const selectedImageRoomType = allImages[index]?.roomType;
                    if (selectedImageRoomType && selectedImageRoomType !== selectedRoom) {
                      setSelectedRoom(selectedImageRoomType);
                    }
                  }}
                />
              )}
            </ImageGalleryContainer>

            <YStack display="block" m="$8">
              {customer?.stripeSubscriptionStatus === 'active' ? (
                <Button icon={<Upload size={26} color="white" />} width={300}>
                  <RoomTypeButtonText>
                    {pageContet?.callToAction || 'Качи Снимка'}
                  </RoomTypeButtonText>
                </Button>
              ) : (
                <AlertButton
                  buttonText={pageContet?.callToAction || 'Свържи се с нас'}
                  title="Нужен Абонамент"
                  description="За да качите снимка е нужно да се абонирате"
                  onConfirmText="Абонирай се"
                  onConfirm={handleButtonPress}
                />
              )}
            </YStack>
          </MyYStack>
        </>
      )}
    </div>
  );
}

// Function to fetch images for all rooms
const fetchAllImages = async (roomIds: string[]) => {
  try {
    const allImages: GroupedImages = [];

    // Fetch images for each room
    for (const roomId of roomIds) {
      const { data: files, error } = await supabase.storage.from('gallery').list(roomId, {
        limit: 100,
        offset: 0,
      });

      if (error) {
        console.error(`Error fetching images for room ${roomId}:`, error);
        continue;
      }

      if (files && files.length > 0) {
        // Get public URLs for each file
        const imagesData = files
          .filter(file => file.name !== '.emptyFolderPlaceholder') // Filter out placeholder files
          .map(file => {
            const { data } = supabase.storage
              .from('gallery')
              .getPublicUrl(`${roomId}/${file.name}`);

            const imageName = file.name.split('.').slice(0, -1).join('.') || file.name;

            return {
              name: imageName,
              url: data.publicUrl,
              roomType: roomId,
            };
          });

        allImages.push(...imagesData);
      }
    }

    return allImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};
