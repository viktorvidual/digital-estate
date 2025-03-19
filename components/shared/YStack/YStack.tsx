import React from 'react';
import { YStack as TamaguiYStack, YStackProps } from 'tamagui';

type MyYStackProps = {
  children: React.ReactNode;
  bg?: string;
  props?: YStackProps;
};

export const MyYStack = ({ children, bg, ...props }: MyYStackProps) => {
  return (
    <TamaguiYStack
      padding="$4"
      width="100%"
      alignSelf="center"
      bg={bg}
      $lg={{
        px: '15%',
      }}
      {...props}
    >
      {children}
    </TamaguiYStack>
  );
};
