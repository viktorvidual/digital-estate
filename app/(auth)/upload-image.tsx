import React from 'react';
import { MyYStack } from '@/components/shared';
import { ImageInput, ProcessImageButton } from '@/components/UploadImageScreen';

export default function UploadImageScreen() {
  return (
    <MyYStack>
      <ImageInput />
      <ProcessImageButton />
    </MyYStack>
  );
}
