import { styled, View, XStack, YStack, Button } from 'tamagui';

export const ImageSettingsButton = styled(Button, {
  width: '100%',
  height: 50,
  justify: 'space-between',
  items: 'center',
  p: '$3',
  rounded: '$6',
  borderColor: 'grey',
  borderWidth: 1,
  hoverStyle: {
    bg: '$blue3',
    borderColor: '$blue10',
  },
  bg: 'white',
  gap: '$2',
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

export const ImageSettingsButtonInnerContainer = styled(XStack, {});
