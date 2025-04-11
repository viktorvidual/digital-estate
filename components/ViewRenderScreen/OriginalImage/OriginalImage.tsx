import React from 'react';
import { YStack, Button, getTokens } from 'tamagui';
import { MyText, NewSelect } from '@/components/shared';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';
import { useAuthStore, useViewRenderStore } from '@/stores';
import { createVariations } from '@/services';

export const OriginalImage = () => {
  const tokens = getTokens();

  const { customer } = useAuthStore();
  const {
    render,
    roomType,
    setRoomType,
    addVariations,
    furnitureStyle,
    setFurnitureStyle,
    variations,
  } = useViewRenderStore();

  const buttonDissabled = !roomType.value || !furnitureStyle.value;

  const onCreateNewVariations = async () => {
    let baseVariationId;

    for (const variation of variations) {
      if (variation.baseVariationId) {
        baseVariationId = variation.baseVariationId;
        break;
      }
    }

    if (!customer || !render || !baseVariationId) {
      return console.error('No customer or render data');
    }

    const params = {
      style: furnitureStyle.value,
      roomType: roomType.value,
      addVirtuallyStagedWatermark: true,
      baseVariationId: baseVariationId,
      renderId: render?.renderId,
      userId: customer?.userId,
    };

    console.log(params);

    const { error, data } = await createVariations(params);

    if (error || !data) {
      return console.error(error || 'No data from create variations');
    }

    console.log(data);
  
    addVariations(data);
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
      <Button
        bg={buttonDissabled ? '$blue6' : '$blue10'}
        mt="$1"
        onPress={onCreateNewVariations}
        disabled={buttonDissabled}
      >
        <MyText color="white" fw="bold">
          Генерирай Още
        </MyText>
      </Button>
    </YStack>
  );
};
