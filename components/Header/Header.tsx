import React, { useState } from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { SideBar } from '@/components/SideBar/SideBar';
import { Href } from 'expo-router';

const Routes = [
  {
    name: 'Home',
    href: '/' as Href,
  },
  {
    name: 'Gallery',
    href: '/gallery' as Href,
  },
  {
    name: 'Pricing',
    href: '/pricing' as Href,
  },
];

export const Header = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const media = useMedia();

  return (
    <>
      <XStack
        justify="space-between"
        items="center"
        self="center"
        padding="$4"
        width="100%"
        $lg={{
          width: '80%',
        }}
      >
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

              <Link href="/pricing">
                <Text fontWeight="bold">Pricing</Text>
              </Link>
            </XStack>

            <XStack gap="$2">
              <Button>
                <Text>Login</Text>
              </Button>
              <Button bg="$blue10">
                <Text color="white">Sign Up</Text>
              </Button>
            </XStack>
          </>
        )}

        {!media.lg && (
          <Ionicons
            name="menu"
            size={24}
            color="black"
            onPress={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        )}
      </XStack>

      <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} routes={Routes} />
    </>
  );
};
