import { styled, View, YStack } from 'tamagui';

export const IconContainer = styled(View, {
  width: '$2',
  height: '$2',
  justifyContent: 'center',
  alignItems: 'center',
  bg: '$green8',
  rounded: '$4',
});

export const BlueBackground = styled(YStack, {
  backgroundColor: '$blue12',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '70%',
  $lg: {
    height: '50%',
  },
});
