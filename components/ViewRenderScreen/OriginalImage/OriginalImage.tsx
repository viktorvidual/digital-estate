import React from 'react';
import { YStack, Button, getTokens } from 'tamagui';
import { MyText, NewSelect } from '@/components/shared';
import { Render } from '@/types';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';

type Props = {
  render: Render | null;
  roomType: RoomType;
  furnitureStyle: FurnitureStyle;
  setRoomType: (roomType: RoomType) => void;
  setFurnitureStyle: (furnitureStyle: FurnitureStyle) => void;
};

export const OriginalImage = ({
  render,
  roomType,
  furnitureStyle,
  setRoomType,
  setFurnitureStyle,
}: Props) => {
  const tokens = getTokens();

  return (
    <YStack gap="$2" width={'100%'}>
      <MyText ml="$1" fw="bold" size="$8">
        Оригинал
      </MyText>
      <img
        src={render?.url}
        alt="Render"
        style={{ width: '100%', height: 'auto', borderRadius: tokens.radius['$6'].val }}
      />
      <MyText fw="bold">Вид Стая</MyText>
      <NewSelect
        placeholder="Избери вид стая"
        options={ROOM_TYPES}
        onChange={select => {
          setRoomType(select[0] as RoomType);
        }}
        values={[roomType]}
        searchable={false}
        setValue={setRoomType}
      />
      <MyText fw="bold">Стил Обзавеждане</MyText>
      <NewSelect
        placeholder="Избери стил"
        options={FURNITURE_STYLES}
        onChange={select => {
          setFurnitureStyle(select[0] as FurnitureStyle);
        }}
        values={[furnitureStyle]}
        searchable={false}
        setValue={setFurnitureStyle}
      />
      <Button bg="$blue10" mt="$1">
        <MyText color="white" fw="bold">
          Генерирай Още
        </MyText>
      </Button>
    </YStack>
  );
};
