import React from 'react';
import { View, XStack, YStack } from 'tamagui';
import { ROUTES } from '@/constants';
import { MyText, MyXStack, MyYStack } from '../shared';
import { useMedia } from 'tamagui';
import { Link } from 'expo-router';

export const Footer = () => {
  const media = useMedia();

  return (
    <>
      {media.lg ? (
        <MyXStack bg="$blue12" items="center">
          <View>
            <MyText color="white" fw="bold" size="$6">
              Digital Estate
            </MyText>
          </View>
          <XStack gap="$4" ml={'$5'}>
            {ROUTES.map(route => (
              <Link href={route.href}>
                <MyText color="white">{route.name}</MyText>
              </Link>
            ))}
          </XStack>

          <View width={'33%'} flex={1} items="flex-end">
            <Link href="/legal/privacy-policy">
              <MyText color="white">Политика за поверителност</MyText>
            </Link>
            <Link href="/legal/terms-of-service">
              <MyText color="white">Условия за ползване</MyText>
            </Link>
          </View>
        </MyXStack>
      ) : (
        <MyYStack bg="$blue12">
          <MyText color="white" fw="bold">
            Digital Estate
          </MyText>

          <YStack>
            {ROUTES.map(route => (
              <Link href={route.href}>
                <MyText color="white">{route.name}</MyText>
              </Link>
            ))}
          </YStack>

          <YStack>
            <Link href="/legal/privacy-policy">
              <MyText color="white">Политика за поверителност</MyText>
            </Link>
            <Link href="/legal/terms-of-service">
              <MyText color="white">Условия за ползване</MyText>
            </Link>
          </YStack>
        </MyYStack>
      )}
    </>
  );
};
