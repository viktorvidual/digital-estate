import React, { useState } from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Button } from 'tamagui';
import { SideBar } from '@/components/SideBar/SideBar';
import { Href } from 'expo-router';
import { MyXStack, MyText } from '@/components/shared';
import { Menu } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';

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
  const { session } = useAuthStore();
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
            {session ? (
              <Button bg="$blue10" onPress={() => supabase.auth.signOut()}>
                <MyText color="white" fw="bold">Излез</MyText>
              </Button>
            ) : (
              <>
                <XStack gap="$2">
                  <Button>
                    <MyText fw="bold" color="black" onPress={() => router.navigate('/login')}>
                      Вход
                    </MyText>
                  </Button>
                  <Button bg="$blue10" onPress={() => router.navigate('/register')}>
                    <MyText fw="bold" color="white">
                      Регистрация
                    </MyText>
                  </Button>
                </XStack>
              </>
            )}
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
