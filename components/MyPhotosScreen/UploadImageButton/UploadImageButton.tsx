import React from 'react';
import { useAuthStore } from '@/stores';
import { Button } from 'tamagui';
import { MyText, AlertButton } from '@/components/shared';
import { router } from 'expo-router';
import { useUploadImageStore } from '@/stores';
import { Upload } from '@tamagui/lucide-icons';

export const UploadImageButton = () => {
  const { reset } = useUploadImageStore();

  const onUplaodImage = () => {
    reset();
    router.navigate('/upload-image');
  };

  const onSubscribe = () => router.navigate('/pricing');

  const { customer } = useAuthStore();

  return (
    <>
      {customer?.stripeSubscriptionStatus === 'active' ? (
        <Button bg="$blue10" $lg={{ width: 200 }} width={'100%'} onPress={onUplaodImage} iconAfter={<Upload color="white" size={16} />}>
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
