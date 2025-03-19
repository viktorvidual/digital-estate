import React, { useState } from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { SideBar } from '@/components/SideBar/SideBar';
import { Href } from 'expo-router';
import { MyXStack } from '@/components/shared';

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
      <MyXStack justify="space-between" items="center" self="center">
        <Link href="/">
          <SizableText size="$9" fontWeight="bold">
            Digital Estate
          </SizableText>
        </Link>

        {media.lg && (
          <>
            <XStack gap="$4">
              <Link href="/">
                <Text fontWeight="bold">Начало</Text>
              </Link>

              <Link href="/gallery">
                <Text fontWeight="bold">Галерия</Text>
              </Link>

              <Link href="/pricing">
                <Text fontWeight="bold">Цени</Text>
              </Link>
            </XStack>

            <XStack gap="$2">
              <Button>
                <Text>Вход</Text>
              </Button>
              <Button bg="$blue10">
                <Text color="white">Регистрация</Text>
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
      </MyXStack>

      <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} routes={Routes} />
    </>
  );
};
