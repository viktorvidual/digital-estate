import React from 'react';
import { MyText } from '../shared';
import { XStack, YStack, useMedia } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

const BENEFITS = [
  '95% по-евтино',
  'Бързи резултати',
  'Смяна на мебели',
  'Безплатно демо',
  'Лесена Употреба',
  'Различни стилове',
];

const Item = ({ benefit }: { benefit: string }) => {
  const media = useMedia();

  return (
    <XStack
      key={benefit}
      alignItems="center"
      justify="center"
      gap="$2"
      width="40%"
      $md={{
        width: '15%',
      }}
    >
      <MyText size="$3" color="white" key={benefit} fw="bold">
        {benefit}
      </MyText>
      <Check size={22} color="$green8" />
    </XStack>
  );
};

export const Benefits = () => {
  return (
    <XStack gap="$4" justify="space-between" items="center" width="100%" flexWrap="wrap">
      {BENEFITS.map(benefit => (
        <Item key={benefit} benefit={benefit} />
      ))}
    </XStack>
  );
};
