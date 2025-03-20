import React from 'react';
import { XStack as TamaguiXStack, XStackProps } from 'tamagui';
import { smallScreenPaddingX } from '@/constants';

export const MyXStack = ({ children, ...props }: XStackProps) => {
  return (
    <TamaguiXStack
      padding={smallScreenPaddingX}
      width="100%"
      $lg={{
        px: '15%',
      }}
      {...props}
    >
      {children}
    </TamaguiXStack>
  );
};
