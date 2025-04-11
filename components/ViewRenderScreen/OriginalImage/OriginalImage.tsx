import React from 'react';
import { YStack, Button, getTokens } from 'tamagui';
import { MyText, NewSelect } from '@/components/shared';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';
import { useViewRenderStore } from '@/stores';

export const OriginalImage = () => {
  const tokens = getTokens();

  const { render, roomType, setRoomType, furnitureStyle, setFurnitureStyle } = useViewRenderStore();

  const onCreateNewVariations = () => {
    // Implement the logic to create new variations based on selected room type and furniture style
    console.log(
      'Creating new variations with render id:',
      render?.renderId,
      roomType,
      furnitureStyle
    );
  };

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
      <Button bg="$blue10" mt="$1" onPress={onCreateNewVariations}>
        <MyText color="white" fw="bold">
          Генерирай Още
        </MyText>
      </Button>
    </YStack>
  );
};
