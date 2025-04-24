import React from 'react';
import { XStack as TamaguiXStack, useMedia, XStackProps } from 'tamagui';
import { smallScreenPaddingX } from '@/constants';

export const MyXStack = ({ children, ...props }: XStackProps) => {
  const media = useMedia();

  const paddingX = media['2xl'] ? '20%' : media.lg ? '15%' : smallScreenPaddingX;
  
  return (
    <TamaguiXStack padding={smallScreenPaddingX} width="100%" px={paddingX} {...props}>
      {children}
    </TamaguiXStack>
  );
};
