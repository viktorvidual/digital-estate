import React, { useState } from 'react';
import { Link } from 'expo-router';
import { XStack, SizableText, useMedia, Button, Image, Spinner } from 'tamagui';
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
  const media = useMedia();

  const { session, customer, setCustomer } = useAuthStore();
  const { isSideBarOpen, setIsSideBarOpen } = useSideBarStore();

  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setCustomer(null);
      showToast({
        title: 'Успешно излязохте',
        type: 'error',
      });
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({
        title: 'Грешка при излизане',
        description: 'Моля, опитайте отново.',
        type: 'success',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MyXStack justify="space-between" items="center" self="center" bg="$blue12">
        <Link href="/">
          <XStack items="center" gap="$2">
            <Image width={40} height={40} src={require('@/assets/logo/logo.png')} alt="logo" />
            <SizableText size="$8" fontWeight="bold" color="white">
              DIGITAL-ESTATE.BG
            </SizableText>
          </XStack>
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
                  isLoading={isLoading}
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
