import React from 'react';
import { YStack as TamaguiYStack, YStackProps } from 'tamagui';
import { smallScreenPaddingX } from '@/constants';
type MyYStackProps = {
  children: React.ReactNode;
  bg?: string;
  props?: YStackProps;
};

export const MyYStack = ({ children, bg, ...props }: MyYStackProps) => {
  return (
    <TamaguiYStack
      padding={smallScreenPaddingX}
      width="100%"
      alignSelf="center"
      bg={bg}
      gap="$4"
      $lg={{
        px: '15%',
      }}
      {...props}
    >
      {children}
    </TamaguiYStack>
  );
};
