import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, SizableText, Button, Image } from 'tamagui';
import { router, Href, Link } from 'expo-router';
import { useMedia } from 'tamagui';
import { useAuthStore, useSideBarStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/constants';
import { AlertButton } from '../shared';
import { useShowToast } from '@/hooks';

export const SideBar = () => {
  const showToast = useShowToast();
  const { session, customer, setCustomer } = useAuthStore();
  const { isSideBarOpen, setIsSideBarOpen } = useSideBarStore();

  const onNavigate = (route: Href) => {
    router.navigate(route);
    setIsSideBarOpen(false);
  };

  const onSignOut = () => {
    supabase.auth.signOut();
    setCustomer(null);
    setIsSideBarOpen(false);
    router.navigate('/login');

    showToast({
      title: 'Успешно излязохте',
      type: 'success',
    });
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
            <Link href="/">
              <XStack items="center" gap="$2">
                <Image width={40} height={40} src={require('@/assets/logo/logo.png')} alt="logo" />
                <SizableText size="$8" fontWeight="bold" color="$blue11">
                  DIGITAL-ESTATE.BG
                </SizableText>
              </XStack>
            </Link>
            <Ionicons
              name="close"
              size={24}
              color="black"
              onPress={() => setIsSideBarOpen(!isSideBarOpen)}
            />
          </XStack>
          <YStack gap="$4" mt="$4">
            {ROUTES.map(route => (
              <Pressable key={route.name} onPress={() => onNavigate(route.href)}>
                <SizableText size="$6" fontWeight="bold">
                  {route.name.includes('Цени') && customer?.stripeSubscriptionStatus === 'active'
                    ? 'Абонамент'
                    : route.name}
                </SizableText>
              </Pressable>
            ))}
          </YStack>

          <YStack gap="$4" mt="$4" position="absolute" bottom={100} left="$4" right="$4">
            {!session ? (
              <>
                <Button width="100%" onPress={() => onNavigate('/login')}>
                  <SizableText size="$6" fontWeight="bold">
                    Вход
                  </SizableText>
                </Button>
                <Button width="100%" bg="$blue10" onPress={() => onNavigate('/register')}>
                  <SizableText size="$6" fontWeight="bold" color="white">
                    Регистрация
                  </SizableText>
                </Button>
              </>
            ) : (
              <AlertButton
                title="Излез"
                buttonText="Излез"
                onConfirm={onSignOut}
                description="Сигурни ли сте, че искате да излезете?"
                buttonColor="black"
              />
            )}
          </YStack>
        </YStack>
      )}
    </>
  );
};
