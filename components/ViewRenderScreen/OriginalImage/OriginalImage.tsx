import React, { useCallback, useState } from 'react';
import { YStack, Button, getTokens, Spinner, XStack } from 'tamagui';
import { MyText, NewSelect, Checkbox } from '@/components/shared';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';
import { useAuthStore, useViewRenderStore } from '@/stores';
import { createVariations } from '@/services';
import { Image, BedDouble, Palette } from '@tamagui/lucide-icons';
import { useShowToast } from '@/hooks';

export const OriginalImage = () => {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);

  const tokens = getTokens();

  const { customer } = useAuthStore();
  const {
    render,
    roomType,
    furnitureStyle,
    variations,
    addVirtuallyStagedWatermark,
    setAddVirtuallyStagedWatermark,
    setRoomType,
    addVariations,
    setFurnitureStyle,
  } = useViewRenderStore();

  const onCreateNewVariations = useCallback(async () => {
    if (isLoading) return; // Prevent re-entry if already loading

    setIsLoading(true);
    let baseVariationId;

    console.log('variations', variations);

    for (const variation of variations) {
      if (variation.baseVariationId) {
        baseVariationId = variation.baseVariationId;
        break;
      }
    }

    if (!customer || !render) {
      setIsLoading(false);
      return showToast({
        title: 'Грешка',
        type: 'error',
      });
    }

    const params = {
      style: furnitureStyle.value,
      roomType: roomType.value,
      addVirtuallyStagedWatermark,
      ...(baseVariationId && { baseVariationId: baseVariationId }),
      renderId: render?.renderId,
      userId: customer?.userId,
    };

    console.log(params);

    const { error, data } = await createVariations(params);

    if (error) {
      setIsLoading(false);

      if (error.includes('maximum number of variations')) {
        return showToast({
          title: 'Информация',
          description: 'Достигнат е максималния брой вариации.',
          type: 'info',
        });
      }

      return showToast({
        title: 'Грешка',
        description: error,
        type: 'error',
      });
    }

    if (!data) {
      setIsLoading(false);
      return showToast({
        title: 'Грешка',
        description: 'Неуспешно генериране на вариации',
        type: 'error',
      });
    }

    console.log(data);

    addVariations(data);
    setIsLoading(false);
    showToast({
      title: 'Генерирането започна',
      description: 'Новите вариации ще бъдат готови след около 20 секунди. Моля, изчакайте.',
      type: 'success',
    });
  }, [roomType, furnitureStyle, render, customer]);

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
      <XStack gap="$2" alignItems="center">
        <Palette size={20} />
        <MyText fw="bold">Вид Стая</MyText>
      </XStack>
      <NewSelect
        placeholder="Избери вид стая"
        options={ROOM_TYPES}
        onChange={select => {
          setRoomType(select[0] as RoomType);
        }}
        values={[roomType]}
        searchable={false}
        setValue={setRoomType}
        disabled={isLoading}
      />
      <XStack gap="$2" alignItems="center">
        <BedDouble size={20} />
        <MyText fw="bold">Стил Обзавеждане</MyText>
      </XStack>
      <NewSelect
        placeholder="Избери стил"
        options={FURNITURE_STYLES}
        onChange={select => {
          setFurnitureStyle(select[0] as FurnitureStyle);
        }}
        values={[furnitureStyle]}
        searchable={false}
        setValue={setFurnitureStyle}
        disabled={isLoading}
      />
      <Checkbox
        checked={addVirtuallyStagedWatermark}
        onCheckedChange={setAddVirtuallyStagedWatermark}
        label='Добави надпис "Virtually Staged"'
      />
      <Button
        bg={'$blue10'}
        mt="$1"
        onPress={onCreateNewVariations}
        iconAfter={
          !isLoading ? <Image size={20} style={{ marginLeft: 10 }} color="white" /> : undefined
        }
      >
        <MyText color="white" fw="bold">
          Генерирай Още
        </MyText>
        {isLoading && <Spinner color="white" />}
      </Button>
    </YStack>
  );
};
