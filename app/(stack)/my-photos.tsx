import React, { useEffect } from 'react';
import { MyYStack, MyText } from '@/components/shared';
import { XStack, YStack, useMedia } from 'tamagui';
import { UploadImageButton, PhotosList } from '@/components/MyPhotosScreen';
import { useAuthStore } from '@/stores';
import { useLocalSearchParams } from 'expo-router';
import { useShowToast } from '@/hooks';

export default function MyPhotos() {
  const media = useMedia();
  const { customer } = useAuthStore();

  const { subscriptionCreated } = useLocalSearchParams();

  return (
    <MyYStack>
      <div
        style={{
          minHeight: '79vh',
        }}
      >
        {subscriptionCreated && (
          <MyText size="$8" color="$green10" textAlign="center" fw="bold">
            Успешно активирана абонаментна услуга. Може да качите снимки.
          </MyText>
        )}
        <YStack width={'100%'} bg="#F9FAFB" rounded={'$6'} p={'$4'} gap="$3">
          {media.lg ? (
            <XStack width={'100%'} justify={'space-between'} items="center">
              <MyText size="$9" fw="bold">
                Моите Снимки
              </MyText>

              <XStack gap={'$2'} items="center">
                {customer && customer.stripeSubscriptionStatus === 'active' && (
                  <XStack items="center" bg="$green10" rounded={'$4'} p="$2" px="$3">
                    <MyText color="white" size="$8" fw="bold">
                      {customer.imageCount}{' '}
                    </MyText>
                    <MyText textAlign="center" color="white">
                      кредита
                    </MyText>
                  </XStack>
                )}
                <UploadImageButton />
              </XStack>
            </XStack>
          ) : (
            <>
              <XStack width={'100%'} justify={'space-between'} items="center">
                <MyText size="$9" fw="bold">
                  Моите Снимки
                </MyText>
                {customer && customer.stripeSubscriptionStatus === 'active' && (
                  <YStack items="center" bg="$green10" rounded={'$4'} p="$2">
                    <MyText color="white" size="$8" fw="bold">
                      {customer.imageCount}
                    </MyText>
                    <MyText color="white" size="$2">
                      кредита
                    </MyText>
                  </YStack>
                )}
              </XStack>

              <UploadImageButton />
            </>
          )}
          <PhotosList />
        </YStack>
      </div>
    </MyYStack>
  );
}
