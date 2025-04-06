import React from 'react';
import { useAuthStore, useUploadImageStore } from '@/stores';
import { MyText } from '@/components/shared';
import { Button } from 'tamagui';
import { supabase } from '@/lib/supabase';

export const ProcessImageButton = () => {
  const { customer } = useAuthStore();
  const { setUploading, selectedFile, imageDimensions } = useUploadImageStore();

  const onUpload = async () => {
    if (!selectedFile) {
      return console.error('No file selected');
    }

    setUploading(true);

    const filePath = `${customer?.userId}/${selectedFile.name}`;
    const { error } = await supabase.storage.from('images').upload(filePath, selectedFile);

    if (error) {
      setUploading(false);
      console.error(error.message);
      return;
    }

    const publicUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl;

    const { data: dbData, error: dbError } = await supabase
      .from('images') // Your images table
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
    <Button onPress={onUpload} disabled={!selectedFile} bg={selectedFile ? '$blue10' : '$blue6'}>
      <MyText fw="bold" color="white">
        Обработи Снимката
      </MyText>
    </Button>
  );
};
