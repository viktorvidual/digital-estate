import React from 'react';
import { MyText } from '../../shared';
import { View, XStack } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

const BENEFITS = [
  'Достъпна цена',
  'Мигновени резултати',
  'Премахване на мебели',
  'Колекция от стилове',
  'Лесен за използване',
];

const Item = ({ benefit }: { benefit: string }) => {
  return (
    <XStack
      key={benefit}
      alignItems="center"
      justify="center"
      gap="$2"
      width="40%"
      $md={{
        width: '18%',
      }}
    >
      <View width={'80%'}>
        <MyText color="white" key={benefit} fw="bold">
          {benefit}
        </MyText>
      </View>
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
