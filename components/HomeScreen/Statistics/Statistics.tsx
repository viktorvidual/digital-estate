import React from 'react';
import { MyXStack, MyText } from '@/components/shared';
import { styled, XStack, View } from 'tamagui';
import { ArrowBigUp } from '@tamagui/lucide-icons';

export const Statistics = () => {
  return (
    <MyXStack justify={'space-between'} flexWrap="wrap">
      {STATISTICS.map(el => {
        return <Element el={el} key={el.title} />;
      })}
    </MyXStack>
  );
};

const Element = ({ el }: { el: { title: string; value: string; description: string } }) => {
  return (
    <ElementContainer width="100%">
      <XStack items="center" gap="$2">
        <MyText size="$4" fw="bold">
          {el.title}
        </MyText>
        <ArrowBigUp size={24} color="$green8" fill="hsl(151, 40.2%, 54.1%)" />
      </XStack>
      <MyText size="$12" fw="bold">
        +{el.value}
      </MyText>
      <MyText text="center" $md={{ text: 'left' }}>
        {el.description}
      </MyText>
    </ElementContainer>
  );
};

const ElementContainer = styled(View, {
  gap: '$4',
  padding: '$6',
  width: '100%',
  items: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
  $md: {
    items: 'flex-start',
    width: '33%',
    borderBottomWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
});

const STATISTICS = [
  {
    title: 'Интерес на купувача',
    value: '83%',
    description:
      'Виртуалното представяне оказва положително влияние върху 83% от купувачите, повишавайки техния интерес към вашите обяви.',
  },
  {
    title: 'По-бързи продажби',
    value: '73%',
    description:
      'Обяви за виртуално обзаведени имоти се продават с 73% по-бързо в сравнение с тези, които не са виртуално обзаведени.',
  },
  {
    title: 'По-високи оферти',
    value: '25%',
    description:
      'Обяви за виртуално обзаведени имоти се продават с до 25% по-високи цени в сравнение с тези, които не са виртуално обзаведени.',
  },
];
