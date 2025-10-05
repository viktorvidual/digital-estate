import { styled, YStack, Text } from 'tamagui';
import { Button } from '../shared';

export const HeaderContainer = styled(YStack, {
  name: 'GalleryContainer',
  gap: '$3',
  content: 'center',
  alignSelf: 'center',
  items: 'center',
  width: '100%',
  bg: '$blue13',
  py: '$7',
  px: '$3',
  pb: 200,
  $lg: {
    alignSelf: 'flex-start',
  },
});

export const RoomTypeButton = styled(Button, {
  name: 'RoomTypeButton',
  size: '$2',
  bg: '$blue12',
  color: 'white',
  borderRadius: '$4',
  mr: '$2',
  p: '$5',

  variants: {
    isSelected: {
      true: {
        bg: 'white',
      },
    },
  } as const,
});

export const RoomTypeButtonText = styled(Text, {
  color: 'white',
  fontWeight: 'bold',

  variants: {
    isSelected: {
      true: {
        color: '$blue12',
      },
    },
  },
} as const);

export const ImageGalleryContainer = styled(YStack, {
  name: 'ImageGalleryContainer',
  maxWidth: 1000,
  minHeight: 400,
  alignSelf: 'center',
  borderRadius: '$4',
  overflow: 'hidden',
});


