import React, { useState } from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Button } from 'tamagui';
import { SideBar } from '@/components/SideBar/SideBar';
import { Href } from 'expo-router';
import { MyXStack, MyText } from '@/components/shared';
import { Menu } from '@tamagui/lucide-icons';

const HEADER_ROUTES = [
  {
    name: 'Начало',
    href: '/' as Href,
  },
  {
    name: 'Галерия',
    href: '/gallery' as Href,
  },
  {
    name: 'Цени',
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
            Digital Estate <SizableText size="$9">AI</SizableText>
          </SizableText>
        </Link>

        {media.lg && (
          <>
            <XStack gap="$4">
              {HEADER_ROUTES.map(route => (
                <Link key={route.name} href={route.href}>
                  <MyText fw="bold">{route.name}</MyText>
                </Link>
              ))}
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

        {!media.lg && <Menu size={24} onPress={() => setIsSideBarOpen(!isSideBarOpen)} />}
      </MyXStack>

      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        routes={HEADER_ROUTES}
      />
    </>
  );
};
