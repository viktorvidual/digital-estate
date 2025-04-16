import { styled, View } from 'tamagui';

export const ElementContainer = styled(View, {
  bg: '#001B3A',
  width: '100%',
  $md: {
    width: '48%',
  },
  gap: '$3',
  p: '$4',
  content: 'center',
  rounded: '$4',
});
