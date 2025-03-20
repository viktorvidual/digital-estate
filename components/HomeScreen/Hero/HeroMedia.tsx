import React, { useEffect, useState } from 'react';
import { Image, YStack, styled, View, useMedia } from 'tamagui';
import { DropDownSelect } from '@/components/shared';

// Define types for better type safety
type RoomType = 'Спалня' | 'Хол';
type FurnitureType = 'Оригинален' | 'Скандинавски' | 'Модерен';

export const HeroMedia = () => {
  const [roomType, setRoomType] = useState<RoomType>('Спалня');
  const [furnitureType, setFurnitureType] = useState<FurnitureType>('Оригинален');

  // Get image source based on selected types
  const imageSource = getImageSource(furnitureType, roomType);

  return (
    <YStack
      width="100%"
      height={'50vh'}
      $lg={{ width: '60%', height: '60vh', maxWidth: 800, maxHeight: 600, alignSelf: 'center' }}
    >
      <Image source={imageSource} maxWidth="100%" maxHeight="100%" rounded="$6" />
      <RoomsContainer>
        <DropDownSelect
          items={FURNITURE_TYPES}
          label="Стил Обзавеждане"
          value={furnitureType}
          onValueChange={value => setFurnitureType(value as FurnitureType)}
        />
      </RoomsContainer>

      <FurnituresContainer>
        <DropDownSelect
          items={ROOM_TYPES}
          label="Вид Стая"
          value={roomType}
          onValueChange={value => setRoomType(value as RoomType)}
        />
      </FurnituresContainer>
    </YStack>
  );
};

// More strongly typed room and furniture types
const ROOM_TYPES = [
  { name: 'Спалня' as RoomType, id: '1' },
  { name: 'Хол' as RoomType, id: '2' },
];

const FURNITURE_TYPES = [
  { name: 'Оригинален' as FurnitureType, id: '1' },
  { name: 'Скандинавски' as FurnitureType, id: '2' },
  { name: 'Модерен' as FurnitureType, id: '3' },
];

const imagePaths = {
  Оригинален: {
    Хол: require('@/assets/samples/1 _Furnished_Troshevo Living Room.jpg'),
    Спалня: require('@/assets/samples/5 _Furnished_Troshevo_Bedroom.jpg'),
  },
  Модерен: {
    Хол: require('@/assets/samples/2_Furnished-Troshevo-Living-Room-Living Room-Modern.jpg'),
    Спалня: require('@/assets/samples/6_Furnished-Troshevo_Bedroom_Bedroom_Modern.jpg'),
  },
  Скандинавски: {
    Хол: require('@/assets/samples/3 _Furnished-Troshevo-Living-Room_Living Room _Scandinavian.jpg'),
    Спалня: require('@/assets/samples/5-Furnished-Troshevo-Bedroom_Bedroom_Scandinavian.jpg'),
  },
};

// Helper function to get image source
const getImageSource = (furnitureType: FurnitureType, roomType: RoomType) => {
  // Create a mapping of image paths
  return imagePaths[furnitureType][roomType];
};

const RoomsContainer = styled(View, {
  position: 'absolute',
  bottom: '$2',
  left: '$2',
});

const FurnituresContainer = styled(View, {
  position: 'absolute',
  bottom: '$2',
  right: '$2',
});
