import React, { useState } from 'react';
import { Image, YStack, styled, View, useMedia } from 'tamagui';
import { DropDownSelect } from '@/components/shared';
import { supabase } from '@/lib/supabase';

// Define types for better type safety
type RoomType = 'Спалня' | 'Трапезария' | 'Хол' | 'Открито';

type FurnitureType =
  | 'Коастъл'
  | 'Фармхаус'
  | 'Индустриален'
  | 'Луксозен'
  | 'Мид-сенчъри'
  | 'Модерен'
  | 'Оригинален'
  | 'Скандинавски'
  | 'Стандартен';

export const HeroMedia = ({ componentWidth }: { componentWidth: number }) => {
  const [roomType, setRoomType] = useState<RoomType>('Спалня');
  const [furnitureType, setFurnitureType] = useState<FurnitureType>('Оригинален');

  // Get image source based on selected types
  const imageSource = getImageUrl(furnitureType, roomType);

  const media = useMedia();

  const imageRatio = 800 / 600;
  const mediaComponentWidth = media.lg ? componentWidth * 0.55 : componentWidth - 32;
  const mediaComponentHeight = mediaComponentWidth / imageRatio;

  return (
    <YStack
      $lg={{
        alignSelf: 'center',
      }}
    >
      <Image
        source={{ uri: imageSource }}
        width={mediaComponentWidth}
        height={mediaComponentHeight}
        rounded="$6"
        aspectRatio={imageRatio}
      />
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
const ROOM_TYPES: { name: RoomType; id: string }[] = [
  { name: 'Спалня', id: 'bedroom.jpg' },
  { name: 'Трапезария', id: 'diningRoom.jpg' },
  { name: 'Хол', id: 'livingRoom.jpg' },
  { name: 'Открито', id: 'outdoor.jpg' },
];

const FURNITURE_TYPES: { name: FurnitureType; id: string }[] = [
  { name: 'Оригинален', id: 'original' },
  { name: 'Модерен', id: 'modern' },
  { name: 'Луксозен', id: 'luxury' },
  { name: 'Индустриален', id: 'industrial' },
  { name: 'Фармхаус', id: 'farmhouse' },
  { name: 'Мид-сенчъри', id: 'mid-century' },
  { name: 'Скандинавски', id: 'scandinavian' },
  { name: 'Коастъл', id: 'coastal' },
  { name: 'Стандартен', id: 'standard' },
];

const furnitureTypeToFolder: Record<FurnitureType, string> = {
  Коастъл: 'coastal',
  Фармхаус: 'farmhouse',
  Индустриален: 'industrial',
  Луксозен: 'luxury',
  'Мид-сенчъри': 'mid-century',
  Модерен: 'modern',
  Оригинален: 'original',
  Скандинавски: 'scandinavian',
  Стандартен: 'standard',
};

const roomTypeToFilename: Record<RoomType, string> = {
  Спалня: 'bedroom.jpg',
  Трапезария: 'diningRoom.jpg',
  Хол: 'livingRoom.jpg',
  Открито: 'outdoor.jpg',
};

// Helper function to get image source
const getImageUrl = (furnitureType: FurnitureType, roomType: RoomType) => {
  const styleFolder = furnitureTypeToFolder[furnitureType];
  const roomFile = roomTypeToFilename[roomType];
  const { data } = supabase.storage
    .from('home-page')
    .getPublicUrl(`heroMedia/${styleFolder}/${roomFile}`);
  console.log('public url', data.publicUrl);

  return data.publicUrl;
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
