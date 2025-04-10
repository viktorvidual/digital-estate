import React from 'react';
import { YStack as TamaguiYStack, useMedia, YStackProps } from 'tamagui';
import { smallScreenPaddingX } from '@/constants';
type MyYStackProps = {
  children: React.ReactNode;
  bg?: string;
  props?: YStackProps;
};

export const MyYStack = ({ children, bg, ...props }: MyYStackProps) => {
  const media = useMedia();

  const paddingX = media['2xl'] ? '20%' : media['lg'] ? '15%' : smallScreenPaddingX;
  return (
    <TamaguiYStack
      padding={smallScreenPaddingX}
      width="100%"
      alignSelf="center"
      bg={bg}
      gap="$4"
      px={paddingX}
      {...props}
    >
      {children}
    </TamaguiYStack>
  );
};
