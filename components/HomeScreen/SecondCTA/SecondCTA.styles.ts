import { styled, View } from 'tamagui';

export const ElementContainer = styled(View, {
  width: '100%',
  $md: {
    width: '48%',
  },
  gap: '$3',
  p: '$4',
  content: 'center',
  rounded: '$4',
});
