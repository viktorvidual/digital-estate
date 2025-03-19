import React, { useState } from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Button } from 'tamagui';
import { SideBar } from '@/components/SideBar/SideBar';
import { Href } from 'expo-router';
import { MyXStack, MyText } from '@/components/shared';
import { Menu } from '@tamagui/lucide-icons';

const HEADER_ROUTES = [
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
      <MyXStack justify="space-between" items="center" self="center" bg="$blue12">
        <Link href="/">
          <SizableText size="$9" fontWeight="bold" color="white">
            Digital Estate
          </SizableText>
        </Link>

        {media.lg && (
          <>
            <XStack gap="$4">
              <Link href="/">
                <MyText fw="bold" color="white">
                  Начало
                </MyText>
              </Link>

              <Link href="/gallery">
                <MyText fw="bold" color="white">
                  Галерия
                </MyText>
              </Link>

              <Link href="/pricing">
                <MyText fw="bold" color="white">
                  Цени
                </MyText>
              </Link>
            </XStack>

            <XStack gap="$2">
              <Button>
                <MyText fw="bold" color="black">
                  Вход
                </MyText>
              </Button>
              <Button bg="$blue10">
                <MyText fw="bold" color="white">
                  Регистрация
                </MyText>
              </Button>
            </XStack>
          </>
        )}

        {!media.lg && (
          <Menu
            size={24}
            color="white"
            onPress={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        )}
      </MyXStack>

      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        routes={HEADER_ROUTES}
      />
    </>
  );
};
