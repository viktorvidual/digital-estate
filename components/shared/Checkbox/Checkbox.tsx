import React from 'react';
import { XStack } from 'tamagui';
import { Square, SquareCheckBig } from '@tamagui/lucide-icons';
import { MyText } from '../MyText/MyText';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  size?: number;
}

export const Checkbox = ({ checked, onCheckedChange, label, size = 20 }: CheckboxProps) => {
  return (
    <XStack
      width={'100%'}
      $lg={{ width: 500 }}
      alignItems="center"
      gap="$2"
      onPress={() => onCheckedChange(!checked)}
      cursor="pointer"
      height={40}
      ml="$2"
    >
      {checked ? (
        <SquareCheckBig size={size} color="$green10" />
      ) : (
        <Square size={size} color={'black'} />
      )}
      <MyText size="$5">
        {label}
      </MyText>
    </XStack>
  );
};
