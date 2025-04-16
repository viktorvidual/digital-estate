import { styled, XStack } from 'tamagui';

export const ToggleContainer = styled(XStack, {
  borderRadius: '$10',
  backgroundColor: '#141A2F',
});

export const ToggleItem = styled(XStack, {
  borderRadius: '$10',
  padding: '$2',
  paddingHorizontal: '$5',
  cursor: 'pointer',
  alignItems: 'center',

  variants: {
    selected: {
      true: {
        backgroundColor: 'white',
      },
    },
  } as const,
});
