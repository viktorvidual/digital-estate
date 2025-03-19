import React from 'react';
import {} from 'tamagui';
import { XStack as TamaguiXStack, XStackProps } from 'tamagui';

export const MyXStack = ({ children, ...props }: XStackProps) => {
  return (
    <TamaguiXStack
      padding="$4"
      width="100%"
      $lg={{
        width: '80%',
      }}
      {...props}
    >
      {children}
    </TamaguiXStack>
  );
};
