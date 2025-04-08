import React from 'react';
import { useAuthStore, useUploadImageStore } from '@/stores';
import { MyText } from '@/components/shared';
import { YStack, Button, XStack } from 'tamagui';
import { supabase } from '@/lib/supabase';
import { CircleMinus } from '@tamagui/lucide-icons';
import { CirclePlus } from '@tamagui/lucide-icons';
import { Square } from '@tamagui/lucide-icons';
import { ImageSettingsButton } from './ProcessImageButtons.styles';
import { CheckSquare2 } from '@tamagui/lucide-icons';
import { v7 as uuidv7 } from 'uuid';

export const ProcessImageButtons = () => {
  const { customer } = useAuthStore();
  const {
    addNewFurniture,
    setAddNewFurniture,
    removeFurniture,
    setRemoveFurniure,
    setUploading,
    selectedFile,
    imageDimensions,
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

    setUploading(false);

    if (dbError) {
      console.error('Error saving image to DB: ', dbError);
    } else {
      console.log('Image saved to DB: ', dbData);
    }

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
        onPress={() => setRemoveFurniure(!removeFurniture)}
      >
        <XStack gap="$2" items={'center'}>
          <CircleMinus size={20} color="$blue11" />
          <MyText>Премахни Мебелите</MyText>
        </XStack>
        {removeFurniture ? <CheckSquare2 size={20} color="$blue11" /> : <Square size={20} />}
      </ImageSettingsButton>

      <ImageSettingsButton
        selected={addNewFurniture}
        onPress={() => setAddNewFurniture(!addNewFurniture)}
      >
        <XStack gap="$2" items={'center'}>
          <CirclePlus size={20} gap="$2" color="$blue11" />
          <MyText>Добави Обзавеждане</MyText>
        </XStack>
        {addNewFurniture ? <CheckSquare2 size={20} color="$blue11" /> : <Square size={20} />}
      </ImageSettingsButton>

      <Button
        width={'100%'}
        onPress={onUpload}
        disabled={!selectedFile}
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
