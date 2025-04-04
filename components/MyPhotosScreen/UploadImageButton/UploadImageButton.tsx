import React from 'react';
import { useAuthStore } from '@/stores';
import { Button } from 'tamagui';
import { MyText, AlertButton } from '@/components/shared';
import { router } from 'expo-router';

export const UploadImageButton = () => {
  const onUplaodImage = () => router.navigate('/upload-image');

  const onSubscribe = () => router.navigate('/pricing');

  const { customer } = useAuthStore();

  return (
    <>
      {customer?.stripeSubscriptionStatus === 'active' ? (
        <Button bg="$blue10" $lg={{ width: 200 }} width={'100%'} onPress={onUplaodImage}>
          <MyText fontWeight="bold" color="white">
            Kaчи Снимка
          </MyText>
        </Button>
      ) : (
        <AlertButton
          buttonText="Качи Снимка"
          title="Нужен Абонамент"
          description="За да качите снимка е нужно да се абонирате"
          onConfirmText="Абонирай се"
          onConfirm={onSubscribe}
        />
      )}
    </>
  );
};
