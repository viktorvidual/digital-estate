import React, { useState, useRef, useLayoutEffect } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import {
  ImageInputContainer,
  DeleteImageContainer,
  ImageLoadingContainer,
} from '@/components/UploadImageScreen';
import { Upload } from '@tamagui/lucide-icons';
import { Button, YStack, Spinner } from 'tamagui';
import { Trash } from '@tamagui/lucide-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';

export default function UploadImageScreen() {
  const { customer } = useAuthStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localImage, setLocalImage] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const [uploading, setUploading] = useState(false);

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!customer) {
      return console.error('No customer. Please log out and log in again');
    }

    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLocalImage(previewUrl);

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  };

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
    <MyYStack>
      {!localImage && (
        <>
          <ImageInputContainer onPress={() => inputRef.current?.click()}>
            <>
              <Upload size={20} />
              <MyText fw="medium" size="$5">
                Kaчи Снимка
              </MyText>
            </>
          </ImageInputContainer>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={pickImage}
            style={{
              display: 'none',
            }}
          />
        </>
      )}

      {localImage && (
        <YStack width={'100%'}>
          {uploading && (
            <ImageLoadingContainer gap="$3">
              <Spinner size="large" />
              <MyText color="white">Обработка...</MyText>
            </ImageLoadingContainer>
          )}
          <DeleteImageContainer onPress={() => setLocalImage('')}>
            <Trash color="white" size={20} />
          </DeleteImageContainer>
          <img
            src={localImage}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: 10,
            }}
          />
        </YStack>
      )}
      <Button onPress={onUpload} disabled={!localImage} bg={localImage ? '$blue10' : '$blue6'}>
        <MyText fw="bold" color="white">
          Обработи Снимката
        </MyText>
      </Button>
    </MyYStack>
  );
}
