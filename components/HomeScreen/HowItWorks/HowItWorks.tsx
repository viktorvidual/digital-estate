import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { Image, XStack, styled, View, useMedia } from 'tamagui';
import { MyText, MyXStack, MyYStack } from '@/components/shared';
import { Settings, Sparkles } from '@tamagui/lucide-icons';
import { ElementContainer, NumberContainer, ImageIconContainer } from './HowItWorks.styles';

const STEPS = [
  {
    title: 'Качете снимка',
    description: 'Поддържаме както обзаведени, така и необзаведени стаи.',
    media: require('@/assets/samples/living-room/unfurnished.jpg'),
    id: '1',
  },
  {
    title: 'AI Магия',
    description: 'Нашият AI ще обзаведе пространството Ви за 20 секунди.',
    media: require('@/assets/samples/living-room/unfurnished.jpg'),
    id: '2',
  },
  {
    title: 'Изтегли и заблести',
    description: 'Изтеглете обзаведената снимка и я използвайте за успешна реклама.',
    media: require('@/assets/samples/living-room/scandinavian.jpg'),
    id: '3',
  },
];

export const HowItWorks = () => {
  return (
    <>
      <MyYStack items="center">
        <XStack items="center" gap="$2">
          <View bg="$green8" rounded="$4" p="$2">
            <Settings size={16} color="white" />
          </View>
          <MyText fw="bold">Как работи</MyText>
        </XStack>
        <MyText type="title">
          Чисто нова обява{' '}
          <MyText fw="bold" type="title">
            само за няколко секунди
          </MyText>
        </MyText>

        <View
          $lg={{
            width: '86%',
          }}
        >
          <MyText>
            Поедвайте <MyText fw="bold">три лесни стъпки</MyText> , за да създадете най-добрата
            визия за вашия имот, която ще привлече вниманието на купувачите и ще ускори продажбата.
          </MyText>
        </View>
      </MyYStack>

      <MyXStack justify={'space-between'} flexWrap="wrap" gap="$4">
        {STEPS.map((el, index) => {
          return <Element el={el} key={el.title} isSeconStep={index === 1} />;
        })}
      </MyXStack>
    </>
  );
};

const Element = ({
  el,
  isSeconStep,
}: {
  el: { title: string; value: string; description: string; media: ImageSourcePropType; id: string };
  isSeconStep: boolean;
}) => {
  const media = useMedia();

  const width = media['2xl'] ? '32%' : media.md ? '31%' : '100%';

  return (
    <ElementContainer width={width}>
      <XStack gap="$2" items="center" justify="space-between" width="100%">
        <MyText size="$8" fw="bold">
          {el.title}
        </MyText>
        <NumberContainer>
          <MyText fw="bold">{el.id}</MyText>
        </NumberContainer>
      </XStack>

      <MyText>{el.description}</MyText>

      <View maxWidth={'100%'} maxHeight={200}>
        {isSeconStep && (
          <ImageIconContainer>
            <XStack
              p="$3"
              bg="$black3"
              rounded="$6"
              justifyContent="center"
              alignItems="center"
              gap="$3"
              opacity={0.8}
            >
              <Sparkles size={16} color="white" />
              <MyText color="white" fw="bold" size="$3">
                Добавяне на мебели...
              </MyText>
            </XStack>
          </ImageIconContainer>
        )}

        <Image maxWidth={'100%'} maxHeight={'100%'} source={el.media} rounded="$6" />
      </View>
    </ElementContainer>
  );
};
