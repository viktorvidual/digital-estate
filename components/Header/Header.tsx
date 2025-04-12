import React from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Button } from 'tamagui';
import { MyXStack, MyText, AlertButton } from '@/components/shared';
import { Menu } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/constants';
import { useSideBarStore } from '@/stores';
import { useShowToast } from '@/hooks';

export const Header = () => {
  const showToast = useShowToast();

  const { session, customer, setCustomer } = useAuthStore();
  const { isSideBarOpen, setIsSideBarOpen } = useSideBarStore();

  const media = useMedia();

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setCustomer(null);
    }

    showToast({
      title: 'Успешно излязохте',
      type: 'error',
    });
  };

  return (
    <>
      <MyXStack justify="space-between" items="center" self="center" bg="$blue12">
        <Link href="/">
          <SizableText size="$9" fontWeight="bold" color="white">
            Digital Estate{' '}
            <SizableText color="white" size="$9">
              AI
            </SizableText>
          </SizableText>
        </Link>

        {media.lg && (
          <>
            <XStack gap="$4">
              {ROUTES.map(route => (
                <Link key={route.name} href={route.href}>
                  <MyText fw="bold" color="white">
                    {route.name.includes('Цени') && customer?.stripeSubscriptionStatus === 'active'
                      ? 'Абонамент'
                      : route.name}
                  </MyText>
                </Link>
              ))}
            </XStack>
            {session ? (
              <XStack gap="$2">
                <AlertButton
                  title="Излез"
                  buttonText="Излез"
                  onConfirm={onLogout}
                  description="Сигурни ли сте, че искате да излезете?"
                  buttonTextColor="black"
                  buttonColor="white"
                />
              </XStack>
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

        {!media.lg && (
          <Menu color="white" siize={24} onPress={() => setIsSideBarOpen(!isSideBarOpen)} />
        )}
      </MyXStack>
    </>
  );
};
