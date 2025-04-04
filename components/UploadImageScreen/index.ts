import { styled, View, YStack } from 'tamagui';

export const ImageInputContainer = styled(YStack, {
  width: '100%',
  height: 250,
  justify: 'center',
  items: 'center',
  cursor: 'pointer',
  borderColor: 'grey',
  borderWidth: 0.5,
  borderStyle: 'dotted',
  rounded: '$4',
  gap: '$2',
  hoverStyle: {
    bg: '#f0f0f0',
    borderColor: '#999',
  },
  pressStyle: {
    backgroundColor: '#e0e0e0',
    borderColor: '#666',
  },
  bg: "white"
});

export const DeleteImageContainer = styled(View, {
  position: 'absolute',
  top: '3%',
  right: '3%',
  p: '$2',
  bg: '$black3',
  rounded: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$3',
  opacity: 0.8,
  hoverStyle: {
    bg: '#f0f0f0',
    borderColor: '#999',
  },
  pressStyle: {
    backgroundColor: '#e0e0e0',
    borderColor: '#666',
  },
});
