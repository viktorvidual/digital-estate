import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Image, YStack, styled, View, getTokens } from 'tamagui';
import { DropDownSelect } from '@/components/shared';
import { supabase } from '@/lib/supabase';

//The types below are used to define the options for the dropdowns
const ROOM_TYPES: { name: RoomType; id: string }[] = [
  { name: 'Хол', id: 'livingRoom.jpg' },
  { name: 'Спалня', id: 'bedroom.jpg' },
  { name: 'Трапезария', id: 'diningRoom.jpg' },
  { name: 'Открито', id: 'outdoor.jpg' },
];

// The types below are used to define the options for the dropdowns
const FURNITURE_TYPES: { name: FurnitureType; id: string }[] = [
  { name: 'Оригинален', id: 'original' },
  { name: 'Модерен', id: 'modern' },
  { name: 'Луксозен', id: 'luxury' },
  // { name: 'Индустриален', id: 'industrial' },
  // { name: 'Фармхаус', id: 'farmhouse' },
  { name: 'Мид-сенчъри', id: 'mid-century' },
  { name: 'Скандинавски', id: 'scandinavian' },
  { name: 'Коастъл', id: 'coastal' },
  { name: 'Стандартен', id: 'standard' },
];

const STYLE_EFFECT_DURATION = 3000; // Duration for the style effect in milliseconds
const ROOM_EFFECT_DURATION = FURNITURE_TYPES.length * STYLE_EFFECT_DURATION; // Total duration for the room effect

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

const ASPECT_RATIO = 2976 / 1676;

export const HeroMedia = () => {
  const roomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roomProgressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [roomProgress, setRoomProgress] = useState(0);

  const furnitureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [furnitureProgress, setFurnitureProgress] = useState(0);

  const [roomType, setRoomType] = useState<RoomType>(ROOM_TYPES[0].name);
  const [furnitureType, setFurnitureType] = useState<FurnitureType>(FURNITURE_TYPES[0].name);

  const [currentIndexFurnitureType, setCurrentIndexFurnitureType] = useState(0);
  const [currentIndexRoomType, setCurrentIndexRoomType] = useState(0);

  // Get image source based on selected types
  const imageSource = useMemo(
    () => getImageUrl(furnitureType, roomType),
    [furnitureType, roomType]
  );

  useEffect(() => {
    const furnitureIndex = FURNITURE_TYPES.findIndex(item => item.name === furnitureType);
    const roomIndex = ROOM_TYPES.findIndex(item => item.name === roomType);

    setCurrentIndexFurnitureType(furnitureIndex);
    setCurrentIndexRoomType(roomIndex);
  }, [furnitureType, roomType]);

  //furniture effect
  useEffect(() => {
    if (furnitureTimerRef.current) {
      clearTimeout(furnitureTimerRef.current);
    }

    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }

    const start = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / STYLE_EFFECT_DURATION) * 100, 100);
      setFurnitureProgress(percent);
    }, 50);

    furnitureTimerRef.current = setTimeout(() => {
      let nextFurnitureIndex = currentIndexFurnitureType + 1;

      if (nextFurnitureIndex >= FURNITURE_TYPES.length) {
        nextFurnitureIndex = 0;
      }

      setFurnitureType(FURNITURE_TYPES[nextFurnitureIndex].name);
      setFurnitureProgress(0);
    }, STYLE_EFFECT_DURATION);

    return () => {
      furnitureTimerRef.current && clearTimeout(furnitureTimerRef.current);
    };
  }, [furnitureType, currentIndexFurnitureType]);

  useEffect(() => {
    if (roomTimerRef.current) {
      clearTimeout(roomTimerRef.current);
    }

    if (roomProgressTimerRef.current) {
      clearTimeout(roomProgressTimerRef.current);
    }

    const start = Date.now();
    roomProgressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / ROOM_EFFECT_DURATION) * 100, 100);
      setRoomProgress(percent);
    }, 50);

    roomTimerRef.current = setTimeout(() => {
      let nextRoomIndex = currentIndexRoomType + 1;

      if (nextRoomIndex >= ROOM_TYPES.length) {
        nextRoomIndex = 0;
      }

      setRoomType(ROOM_TYPES[nextRoomIndex].name);
      setRoomProgress(0);
    }, ROOM_EFFECT_DURATION);

    return () => {
      roomTimerRef.current && clearTimeout(roomTimerRef.current);
    };
  }, [roomType, currentIndexRoomType]);

  return (
    <YStack
      $lg={{
        alignSelf: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: ASPECT_RATIO,
          minHeight: '30%',
        }}
      >
        <img
          src={imageSource}
          style={{
            aspectRatio: ASPECT_RATIO,
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: getTokens().radius['$6'].val,
          }}
        />
        <RoomsContainer>
          <DropDownSelect
            items={FURNITURE_TYPES}
            label="Стил Обзавеждане"
            value={furnitureType}
            onValueChange={value => setFurnitureType(value as FurnitureType)}
            progress={furnitureProgress}
          />
        </RoomsContainer>

        <FurnituresContainer>
          <DropDownSelect
            items={ROOM_TYPES}
            label="Вид Стая"
            value={roomType}
            onValueChange={value => setRoomType(value as RoomType)}
            progress={roomProgress}
          />
        </FurnituresContainer>
      </div>
    </YStack>
  );
};

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
    .getPublicUrl(`heroMedia/${styleFolder}/${roomFile}`, {
      transform: {
        width: 1539,
        height: 896,
      },
    });

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
