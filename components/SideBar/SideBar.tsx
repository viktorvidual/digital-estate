import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, SizableText, Button } from 'tamagui';
import { router, Href } from 'expo-router';
import { useMedia } from 'tamagui';

type SideBarProps = {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isSideBarOpen: boolean) => void;
  routes: { name: string; href: Href }[];
};

export const SideBar = ({ isSideBarOpen, setIsSideBarOpen, routes }: SideBarProps) => {
  const onPress = (route: Href) => {
    router.navigate(route);
    setIsSideBarOpen(false);
  };

  const isDesktop = useMedia().lg;

  useEffect(() => {
    if (isDesktop) {
      setIsSideBarOpen(false);
    }
  }, [isDesktop]);

  return (
    <>
      {isSideBarOpen && (
        <YStack fullscreen z="$zIndex.1" bg="white" padding="$4">
          <XStack justify="space-between" items="center" self="center" width="100%">
            <SizableText size="$9" fontWeight="bold" color={'$blue10'}>
              Digital Estate
            </SizableText>
            <Ionicons
              name="close"
              size={24}
              color="black"
              onPress={() => setIsSideBarOpen(!isSideBarOpen)}
            />
          </XStack>
          <YStack gap="$4" mt="$4">
            {routes.map(route => (
              <Pressable key={route.name} onPress={() => onPress(route.href)}>
                <SizableText size="$6" fontWeight="bold">
                  {route.name}
                </SizableText>
              </Pressable>
            ))}
          </YStack>

          <YStack gap="$4" mt="$4" position="absolute" bottom="$10" left="$4" right="$4">
            <Button width="100%">
              <SizableText size="$6" fontWeight="bold">
                Вход
              </SizableText>
            </Button>
            <Button width="100%" bg="$blue10">
              <SizableText size="$6" fontWeight="bold" color="white">
                Регистрация
              </SizableText>
            </Button>
          </YStack>
        </YStack>
      )}
    </>
  );
};
