import React from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { Anchor, View, XStack, YStack, useMedia } from 'tamagui';
import { Mail, Phone } from '@tamagui/lucide-icons';

export default function Contacts() {
  const media = useMedia();

  return (
    <MyYStack>
      <div
        style={{
          minHeight: '79vh',
        }}
      >
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
      </div>
    </MyYStack>
  );
}

const ContactButtons = () => {
  return (
    <>
      <XStack
        justify={'space-between'}
        items="center"
        bg="$blue3"
        p="$6"
        rounded="$8"
        width={'100%'}
        $lg={{ width: '40%' }}
      >
        <YStack>
          <MyText
            fw="bold"
            size={'$6'}
            $lg={{
              size: '$8',
              fw: 'bold',
            }}
          >
            Телефон:
          </MyText>
          <Anchor href="tel:+359876252621" target="_blank" rel="noopener noreferrer">
            <MyText
              size={'$6'}
              $lg={{
                size: '$8',
              }}
            >
              +359 87 6252621
            </MyText>
          </Anchor>
        </YStack>
        <View>
          <Phone size={25} color="black" />
        </View>
      </XStack>

      <XStack
        justify={'space-between'}
        items="center"
        bg="$blue3"
        p="$6"
        rounded="$8"
        width={'100%'}
        $lg={{ width: '40%' }}
      >
        <YStack>
          <MyText
            size={'$6'}
            fw="bold"
            $lg={{
              size: '$8',
              fw: 'bold',
            }}
          >
            Email:
          </MyText>
          <Anchor
            href="mailto:digitalestate.bg@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <MyText
              size={'$6'}
              $lg={{
                size: '$8',
              }}
            >
              digitalestate.bg@gmail.com
            </MyText>
          </Anchor>
        </YStack>
        <View>
          <Mail size={25} color="black" />
        </View>
      </XStack>
    </>
  );
};
