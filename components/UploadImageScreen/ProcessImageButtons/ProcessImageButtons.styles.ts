import { styled, View, XStack } from 'tamagui';

export const ImageSettingsButton = styled(XStack, {
  p: '$3',
  rounded: '$6',
  justify: 'space-between',
  items: 'center',
  width: '100%',
  borderColor: 'grey',
  borderWidth: 1,
  hoverStyle: {
    bg: '$blue3',
    borderColor: '$blue10',
  },
  cursor: 'pointer',
  variants: {
    selected: {
      true: {
        bg: '$blue3',
        borderColor: '$blue10',
      },
      false: {},
    },
  } as const,
});
