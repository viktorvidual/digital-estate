import React from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { Anchor, XStack, YStack, useMedia } from 'tamagui';

export default function Contacts() {
  const media = useMedia();

  return (
    <MyYStack>
      <YStack flex={1} items={'center'} content="center" justify={'center'}>
        <XStack width={'100%'} items={'center'} justifyContent="center" mt="$4">
          <MyText type="title" fw="bold">
            Контакти
          </MyText>
        </XStack>

        {media.lg ? (
          <XStack width={'100%'} items={'center'} justifyContent="center" mt="$4" gap={'$5'}>
            <ContactButtons />
          </XStack>
        ) : (
          <YStack width={'100%'} items={'center'} justifyContent="center" mt="$4" gap={'$5'}>
            <ContactButtons />
          </YStack>
        )}
      </YStack>
    </MyYStack>
  );
}

const ContactButtons = () => {
  return (
    <>
      <YStack bg="$blue3" p="$6" rounded="$8" width={'100%'} $lg={{ width: '40%' }}>
        <MyText fw="bold" size={'$8'}>
          Телефон:
        </MyText>
        <Anchor href="tel:+359876252621" target="_blank" rel="noopener noreferrer">
          <MyText size={'$8'}> +359 87 6252621</MyText>
        </Anchor>
      </YStack>

      <YStack bg="$blue3" p="$6" rounded="$8" width={'100%'} $lg={{ width: '40%' }}>
        <MyText fw="bold" size={'$8'}>
          Email:
        </MyText>
        <Anchor
          href="mailto:digitalestate.bg@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <MyText size={'$8'}>digitalestate.bg@gmail.com</MyText>
        </Anchor>
      </YStack>
    </>
  );
};
