import React from 'react';
import { XStack } from 'tamagui';
import { MyYStack } from '@/components/shared';
import { ImageInput, ProcessImageButtons } from '@/components/UploadImageScreen';
import { useMedia } from 'tamagui';

export default function UploadImageScreen() {
  const media = useMedia();
  return (
    <MyYStack>
      <div
        style={{
          minHeight: '79vh',
        }}
      >
        {!media.lg ? (
          <>
            <ImageInput />
            <ProcessImageButtons />
          </>
        ) : (
          <XStack gap="$3">
            <ImageInput />
            <ProcessImageButtons />
          </XStack>
        )}
      </div>
    </MyYStack>
  );
}
