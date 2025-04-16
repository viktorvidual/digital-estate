import { styled, View } from 'tamagui';

export const ElementContainer = styled(View, {
  gap: '$4',
  padding: '$6',
  width: '100%',
  items: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
  $md: {
    items: 'flex-start',
    width: '33%',
    borderBottomWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
});
