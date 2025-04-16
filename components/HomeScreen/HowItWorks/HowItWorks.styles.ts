import { styled, View } from 'tamagui';

export const ElementContainer = styled(View, {
  gap: '$4',
  padding: '$5',
  items: 'flex-start',
  bg: '$blue4',
  rounded: '$6',
});

export const NumberContainer = styled(View, {
  width: '$3',
  height: '$3',
  borderWidth: 0.5,
  borderColor: '$blue12',
  rounded: '$4',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ImageIconContainer = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  rounded: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
});
