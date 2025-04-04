import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { Image, XStack, styled, View, useMedia } from 'tamagui';
import { MyText, MyXStack, MyYStack } from '@/components/shared';
import { Settings, Sparkles } from '@tamagui/lucide-icons';

export const HowItWorks = () => {
  return (
    <>
      <MyYStack items="center">
        <XStack items="center" gap="$2">
          <View bg="$green8" rounded="$4" p="$2">
            <Settings size={16} color="white" />
          </View>
          <MyText>Как работи</MyText>
        </XStack>
        <MyText type="title">
          Получете готови за обява{' '}
          <MyText fw="bold" type="title">
            резултати за секунди
          </MyText>
        </MyText>

        <View
          $lg={{
            width: '86%',
          }}
        >
          <MyText>
            Поедвайте <MyText fw="bold">три лесни стъпки</MyText> , за да превърнете снимките на
            вашия имот в впечатляващи визуализации, които привличат купувачи и правят обявите ви
            по-забележими.
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

const ElementContainer = styled(View, {
  gap: '$4',
  padding: '$5',

  items: 'flex-start',
  bg: '$blue4',
  rounded: '$6',
});

const NumberContainer = styled(View, {
  width: '$3',
  height: '$3',
  borderWidth: 0.5,
  borderColor: '$blue12',
  rounded: '$4',
  justifyContent: 'center',
  alignItems: 'center',
});

const ImageIconContainer = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  rounded: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
});

const STEPS = [
  {
    title: 'Качете снимка',
    description: 'Може да качите снимка на обзавена, както и не необзавена стая',
    media: require('@/assets/samples/living-room/unfurnished.jpg'),
    id: '1',
  },
  {
    title: 'AI Магия',
    description: 'Нашият AI ще преработи вашата снимка за около 15 секунди.',
    media: require('@/assets/samples/living-room/unfurnished.jpg'),
    id: '2',
  },
  {
    title: 'Изтеглете резултата',
    description: 'Изтеглете обзаведената снимка и я използвайте за успешна продажба.',
    media: require('@/assets/samples/living-room/scandinavian.jpg'),
    id: '3',
  },
];
