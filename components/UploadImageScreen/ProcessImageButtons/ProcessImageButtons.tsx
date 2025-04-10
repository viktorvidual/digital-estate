import React, { useCallback } from 'react';
import { useAuthStore, useUploadImageStore } from '@/stores';
import { MyText, NewSelect } from '@/components/shared';
import { YStack, Button, XStack } from 'tamagui';
import { supabase } from '@/lib/supabase';
import { CircleMinus } from '@tamagui/lucide-icons';
import { CirclePlus } from '@tamagui/lucide-icons';
import { Square } from '@tamagui/lucide-icons';
import { ImageSettingsButton } from './ProcessImageButtons.styles';
import { CheckSquare2 } from '@tamagui/lucide-icons';
import { v7 as uuidv7 } from 'uuid';
import { createRender } from '@/services';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';

export const ProcessImageButtons = () => {
  const { customer } = useAuthStore();

  const {
    uploading,
    addNewFurniture,
    setAddNewFurniture,
    removeFurniture,
    setRemoveFurniure,
    setUploading,
    selectedFile,
    imageDimensions,
    roomType,
    furnitureStyle,
    setRoomType,
    setFurnitureStyle,
  } = useUploadImageStore();

  const onUpload = useCallback(async () => {
    if (!selectedFile) {
      return console.error('No file selected');
    }

    if (!customer) {
      return console.error('No customer. Please log out and log in again');
    }

    setUploading(true);

    const imageUid = uuidv7();
    const filePath = `${customer?.userId}/${imageUid}`;

    // Save Image To Storage
    const { error } = await supabase.storage.from('images').upload(filePath, selectedFile);
    if (error) {
      setUploading(false);
      console.error(error.message);
      return;
    }

    const publicUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl;

    // Call The Create Render Endpoint
    const { error: createRenderError, data } = await createRender({
      userId: customer?.userId,
      dimensions: `${imageDimensions.width}x${imageDimensions.height}`,
      filePath: filePath,
      addFurniture: addNewFurniture,
      removeFurniture,
      addVirtuallyStagedWatermark: false,
      style: furnitureStyle.value,
      roomType: roomType.value,
      imageUrl: publicUrl,
    });

    if (createRenderError) {
      console.error('Error creating render: ', createRenderError);
      setUploading(false);
      return;
    }

    console.log('Render created successfully: ', data);

    setUploading(false);

    console.log('image uploaded successfully');
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
        onPress={e => {
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
        </>
      )}

      <Button
        width={'100%'}
        onPress={onUpload}
        disabled={!selectedFile || uploading}
        bg={selectedFile ? '$blue10' : '$blue6'}
        mt="$1"
      >
        <MyText fw="bold" color="white">
          Обработи Снимката
        </MyText>
      </Button>
    </YStack>
  );
};
