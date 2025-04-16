import React from 'react';
import { MyXStack, MyText } from '@/components/shared';
import { XStack } from 'tamagui';
import { ArrowBigUp } from '@tamagui/lucide-icons';
import { ElementContainer } from './Statistics.styles';

const STATISTICS = [
  {
    title: 'Повече заинтересовани купувачи',
    value: '83%',
    description:
      'Виртуалните постановки влияят положително на 83% от купувачите, повишавайки интереса към вашите обяви.',
  },
  {
    title: 'По-бързи продажби',
    value: '73%',
    description: 'Виртуално обзаведените имоти се продават 73% по-бързо от останалите.',
  },
  {
    title: 'По-високи оферти',
    value: '25%',
    description: 'Имотите с виртуални постановки се оценяват средно 25% по-високо',
  },
];

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
