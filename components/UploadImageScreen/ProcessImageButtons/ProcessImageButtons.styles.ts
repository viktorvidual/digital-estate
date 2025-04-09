import { styled, Button, View } from 'tamagui';

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

export const DropDownMenuItem = styled(View, {
  p: 10,
  hoverStyle: {
    bg: '$blue3',
  },
  pressStyle: {
    backgroundColor: '$blue3',
  },
  rounded: '$6',
  variants: {
    selected: {
      true: {
        bg: '$blue10',
        hoverStyle: { bg: '$blue10' },
      },
      false: {},
    },
  } as const,
});
