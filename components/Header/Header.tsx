import React from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Text, Button } from 'tamagui';

export const Header = () => {
  const media = useMedia();

  return (
    <XStack justify="space-between" items="center" width={'100%'}>
      <SizableText size="$9" fontWeight="bold">
        Digital Estate
      </SizableText>

      {media.lg && (
        <>
          <XStack gap="$4">
            <Link href="/">
              <Text fontWeight="bold">Home</Text>
            </Link>

            <Link href="/gallery">
              <Text fontWeight="bold">Gallery</Text>
            </Link>

            <Link href="/about">
              <Text fontWeight="bold">About</Text>
            </Link>
          </XStack>

          <XStack gap="$2">
            <Button>
              <Text>Login</Text>
            </Button>
            <Button>
              <Text>Sign Up</Text>
            </Button>
          </XStack>
        </>
      )}
    </XStack>
  );
};
