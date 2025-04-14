import React, { useCallback } from 'react';
import { useAuthStore, useUploadImageStore, useViewRenderStore } from '@/stores';
import { MyText, NewSelect, Checkbox } from '@/components/shared';
import { YStack, Button, XStack, Spinner } from 'tamagui';
import { supabase } from '@/lib/supabase';
import { CircleMinus, CirclePlus, Square, CheckSquare2, Image } from '@tamagui/lucide-icons';
import { ImageSettingsButton } from './ProcessImageButtons.styles';
import { v7 as uuidv7 } from 'uuid';
import { createRender } from '@/services';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';
import { Render } from '@/types';
import { router } from 'expo-router';
import { useShowToast } from '@/hooks';

export const ProcessImageButtons = () => {
  const showToast = useShowToast();

  const { customer } = useAuthStore();
  const { setRender, reset } = useViewRenderStore();

  const {
    addVirtuallyStagedWatermark,
    uploading,
    addNewFurniture,
    removeFurniture,
    selectedFile,
    imageDimensions,
    roomType,
    furnitureStyle,
    setAddVirtuallyStagedWatermark,
    setAddNewFurniture,
    setRemoveFurniure,
    setUploading,
    setRoomType,
    setFurnitureStyle,
  } = useUploadImageStore();

  const onUpload = useCallback(async () => {
    if (!selectedFile) {
      showToast({
        title: 'Моля, изберете изображение',
        type: 'info',
      });

      return console.error('No file selected');
    }

    if (!customer) {
      return console.error('No customer. Please log out and log in again');
    }

    setUploading(true);

    const imageUid = uuidv7();
    const filePath = `${customer?.userId}/${imageUid}`;

    const { error } = await supabase.storage.from('images').upload(filePath, selectedFile);
    if (error) {
      setUploading(false);
      console.error(error.message);
      return;
    }

    const publicUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl;
    console.log('image uploaded successfully');

    // Call The Create Render Endpoint
    const { error: createRenderError, data } = await createRender({
      userId: customer?.userId,
      dimensions: `${imageDimensions.width}x${imageDimensions.height}`,
      filePath: filePath,
      addFurniture: addNewFurniture,
      removeFurniture,
      addVirtuallyStagedWatermark: addVirtuallyStagedWatermark,
      style: furnitureStyle.value,
      roomType: roomType.value,
      imageUrl: publicUrl,
    });

    if (createRenderError || !data) {
      console.error(createRenderError || 'Error creating render, no data returned');
      setUploading(false);
      return;
    }

    const render: Render = {
      renderId: data.renderId,
      filePath: filePath,
      dimensions: `${imageDimensions.width}x${imageDimensions.height}`,
      url: publicUrl,
    };

    reset();
    setRender(render);

    setUploading(false);
    showToast({
      title: 'Генерирането започна',
      description: 'Новите вариации ще бъдат готови след около 20 секунди. Моля, изчакайте.',
      type: 'success',
      duration: 5000,
    });

    router.replace(`/view-render/${render.renderId}`);
  }, [
    selectedFile,
    customer,
    setUploading,
    imageDimensions,
    addNewFurniture,
    removeFurniture,
    furnitureStyle,
    roomType,
  ]);

  return (
    <YStack
      width="100%"
      $lg={{
        width: '40%',
      }}
      gap="$2"
      justify="center"
    >
      <ImageSettingsButton
        selected={removeFurniture}
        onPress={() => {
          if (uploading) {
            return showToast({
              title: 'Моля, изчакайте',
              type: 'info',
            });
          }
          setRemoveFurniure(!removeFurniture);
        }}
        disabled={uploading}
      >
        <XStack gap="$2" items={'center'}>
          <CircleMinus size={20} color="$blue11" />
          <MyText>Премахни Мебелите</MyText>
        </XStack>
        {removeFurniture ? <CheckSquare2 size={20} color="$blue11" /> : <Square size={20} />}
      </ImageSettingsButton>

      <ImageSettingsButton
        selected={addNewFurniture}
        onPress={e => {
          if (uploading) {
            return showToast({
              title: 'Моля, изчакайте',
              type: 'info',
            });
          }
          setAddNewFurniture(!addNewFurniture);
        }}
        disabled={uploading}
      >
        <XStack gap="$2" items={'center'}>
          <CirclePlus size={20} gap="$2" color="$blue11" />
          <MyText>Добави Обзавеждане</MyText>
        </XStack>
        {addNewFurniture ? <CheckSquare2 size={20} color="$blue11" /> : <Square size={20} />}
      </ImageSettingsButton>

      {addNewFurniture && (
        <>
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
            disabled={uploading}
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
            disabled={uploading}
          />
        </>
      )}

      <Checkbox
        checked={addVirtuallyStagedWatermark}
        onCheckedChange={setAddVirtuallyStagedWatermark}
        label='Добави надпис "Virtually Staged"'
      />

      <Button
        width={'100%'}
        onPress={onUpload}
        bg={'$blue10'}
        mt="$1"
        iconAfter={
          !uploading ? <Image size={20} style={{ marginLeft: 10 }} color="white" /> : undefined
        }
      >
        <MyText fw="bold" color="white">
          Генерирай
        </MyText>
        {uploading && <Spinner color="white" />}
      </Button>
    </YStack>
  );
};
