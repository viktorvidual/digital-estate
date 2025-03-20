import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { Image, XStack, styled, View, useMedia } from 'tamagui';
import { MyText, MyXStack, MyYStack } from '@/components/shared';
import { Settings } from '@tamagui/lucide-icons';

export const HowItWorks = () => {
  return (
    <>
      <MyYStack items="center" gap="$4" mb={-35}>
        <XStack items="center" gap="$2">
          <View bg="$green8" rounded="$4" p="$2">
            <Settings size={16} />
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
        {STEPS.map(el => {
          return <Element el={el} key={el.title} />;
        })}
      </MyXStack>
    </>
  );
};

const Element = ({
  el,
}: {
  el: { title: string; value: string; description: string; media: ImageSourcePropType; id: string };
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
      <Image source={el.media} maxWidth={'100%'} maxHeight={200} rounded="$6" />
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

const STEPS = [
  {
    title: 'Качете снимка',
    description: 'Може да качите снимка на обзавена, както и не необзавена стая',
    media: require('@/assets/samples/1 _Furnished_Troshevo Living Room.jpg'),
    id: '1',
  },
  {
    title: 'AI Магия',
    description: 'Нашият AI ще преработи вашата снимка за около 15 секунди.',
    media: require('@/assets/samples/2_Furnished-Troshevo-Living-Room-Living Room-Modern.jpg'),
    id: '2',
  },
  {
    title: 'Изтеглете резултата',
    description: 'Изтеглете обзаведената снимка и я използвайте за успешна продажба.',
    media: require('@/assets/samples/3 _Furnished-Troshevo-Living-Room_Living Room _Scandinavian.jpg'),
    id: '3',
  },
];
