import { styled, View, YStack } from 'tamagui';

export const ImageInputContainer = styled(YStack, {
  width: '100%',
  height: 400,
  justify: 'center',
  items: 'center',
  cursor: 'pointer',
  borderColor: 'grey',
  borderWidth: 0.5,
  borderStyle: 'dotted',
  rounded: '$4',
  gap: '$2',
  hoverStyle: {
    bg: '$blue3',
    borderColor: '$blue10',
  },
  pressStyle: {
    backgroundColor: '$blue5',
  },
  bg: 'white',
});

export const IconContainer = styled(View, {
  position: 'absolute',
  top: '3%',
  p: '$3',
  bg: '$black3',
  rounded: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0.8,
  hoverStyle: {
    bg: '$blue10',
    borderColor: '#999',
  },
  pressStyle: {
    backgroundColor: '#e0e0e0',
    borderColor: '#666',
  },
  z: '$3',

  variants: {
    positionLeft: {
      true: {
        left: '3%',
        right: 'auto',
      },
    },
    positionRight: {
      true: {
        right: '3%',
        left: 'auto',
      },
    },
  } as const,
});

export const EditMaskButtonsContainer = styled(View, {
  position: 'absolute',
  top: '3%',
  right: '3%',
  p: '$3',
  bg: '$black3',
  rounded: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0.8,
  z: '$3',
  gap: '$3',
});

export const ImageLoadingContainer = styled(View, {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justify: 'center',
  items: 'center',
  opacity: 0.8,
  bg: '$black2',
  zIndex: 10,
  borderRadius: 10,
});
