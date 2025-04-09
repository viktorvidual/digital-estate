import React from 'react';
import { useAuthStore, useUploadImageStore } from '@/stores';
import { MyText } from '@/components/shared';
import { YStack, Button, XStack, getTokens, View } from 'tamagui';
import { supabase } from '@/lib/supabase';
import { CircleMinus } from '@tamagui/lucide-icons';
import { CirclePlus } from '@tamagui/lucide-icons';
import { Square } from '@tamagui/lucide-icons';
import { ImageSettingsButton, DropDownMenuItem } from './ProcessImageButtons.styles';
import { CheckSquare2 } from '@tamagui/lucide-icons';
import { v7 as uuidv7 } from 'uuid';
import { createRender } from '@/services';
import { ROOM_TYPES, FURNITURE_STYLES, RoomType, FurnitureStyle } from '@/constants';
import Select from 'react-dropdown-select';

export const ProcessImageButtons = () => {
  const { customer } = useAuthStore();
  const tokens = getTokens();

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

  const onUpload = async () => {
    if (!selectedFile) {
      return console.error('No file selected');
    }

    setUploading(true);

    const imageUid = uuidv7();
    const filePath = `${customer?.userId}/${imageUid}`;

    //Save Image To Storage
    const { error } = await supabase.storage.from('images').upload(filePath, selectedFile);
    if (error) {
      setUploading(false);
      console.error(error.message);
      return;
    }

    const publicUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl;

    //Save image info to DB
    const { data: dbData, error: dbError } = await supabase
      .from('renders') // Your images table
      .insert([
        {
          user_id: customer?.userId, // The ID of the user uploading the image
          url: publicUrl, // The public URL of the file
          dimensions: `${imageDimensions.width}x${imageDimensions.height}`, // If you want to store image dimensions
          created_at: new Date(),
          file_path: filePath,
        },
      ]);

    if (dbError) {
      console.error('Error saving image to DB: ', dbError);
    } else {
      console.log('Image saved to DB: ', dbData);
    }

    //Call The Create Render Endpoint
    const { error: createRenderError, data } = await createRender({
      addFurniture: addNewFurniture,
      removeFurniture,
      addVirtuallyStagedWatermark: false,
      style: furnitureStyle,
      roomType: roomType,
      imageUrl: publicUrl,
    });

    setUploading(false);

    console.log('image uploaded successfully');
  };

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
          e.stopPropagation();
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
          e.stopPropagation();
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
          <Select
            placeholder="Избери Вид Стая"
            options={ROOM_TYPES}
            onChange={select => {
              setRoomType(select[0] as RoomType);
            }}
            values={[roomType]}
            style={{
              borderRadius: tokens.radius[6].val,
              backgroundColor: 'white',
              height: 45,
            }}
            searchable={false}
            dropdownPosition="auto"
            contentRenderer={({ props, state }) => (
              <View p={10}>
                {state.values.length > 0 ? (
                  <MyText>{state.values[0].label}</MyText>
                ) : (
                  <MyText
                    style={{
                      fontSize: 16,
                      color: '#aaa', // Placeholder color
                    }}
                  >
                    {props.placeholder}
                  </MyText>
                )}
              </View>
            )}
            dropdownRenderer={({ props, methods }) => {
              return (
                <View rounded={'$6'}>
                  {props.options.map(item => {
                    const select = item.value === roomType.value;
                    return (
                      <DropDownMenuItem
                        key={item.value}
                        onPress={() => {
                          setRoomType(item as FurnitureStyle);
                          methods.dropDown('toggle');
                        }}
                        selected={select}
                      >
                        <MyText color={select ? 'white' : 'black'} fw="medium" key={item.value}>
                          {item.label}
                        </MyText>
                      </DropDownMenuItem>
                    );
                  })}
                </View>
              );
            }}
          />
          <MyText fw="bold">Стил Обзавеждане</MyText>
          {/* <Select
            options={FURNITURE_STYLES}
            onChange={select => {
              setFurnitureStyle(select[0] as FurnitureStyle);
            }}
            values={[furnitureStyle]}
            style={{
              borderRadius: tokens.radius[4].val,
              backgroundColor: 'white',
              height: 45,
            }}
            dropdownPosition="auto"
            itemRenderer={({ item, methods }) => (
              <View
                p={'$2'}
                onPress={() => {
                  setFurnitureStyle(item as FurnitureStyle);
                  methods.dropDown('toggle');
                }}
              >
                <MyText fw="medium" key={item.value}>
                  {item.label}
                </MyText>
              </View>
            )}
          /> */}
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
