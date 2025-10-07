import React from 'react';
import { useAuthStore } from '@/stores';
import { Button } from 'tamagui';
import { MyText, AlertButton } from '@/components/shared';
import { router } from 'expo-router';
import { useUploadImageStore } from '@/stores';
import { Upload } from '@tamagui/lucide-icons';

export const UploadImageButton = () => {
  const { reset } = useUploadImageStore();

  const handleUploadImage = () => {
    reset();
    router.navigate('/upload-image');
  };

  const handleSubscribe = () => router.navigate('/pricing');

  const { customer } = useAuthStore();

  return (
    <>
      {customer?.stripeSubscriptionStatus === 'active' && customer.imageCount > 0 && (
        <Button
          bg="$blue10"
          $lg={{ width: 200 }}
          width={'100%'}
          onPress={handleUploadImage}
          iconAfter={<Upload color="white" size={16} />}
        >
          <MyText fontWeight="bold" color="white">
            Kaчи Снимка
          </MyText>
        </Button>
      )}

      {customer?.stripeSubscriptionStatus === 'active' && customer.imageCount === 0 && (
        <AlertButton
          buttonText="Качи Снимка"
          title="Нямате кредити"
          description="За да качите снимка е нужно повишите абонамента си"
          onConfirmText="Повиши Абонамента"
          onConfirm={handleSubscribe}
        />
      )}

      {customer?.stripeSubscriptionStatus !== 'active' && (
        <AlertButton
          buttonText="Качи Снимка"
          title="Нужен Абонамент"
          description="За да качите снимка е нужно да се абонирате"
          onConfirmText="Абонирай се"
          onConfirm={handleSubscribe}
        />
      )}
    </>
  );
};
