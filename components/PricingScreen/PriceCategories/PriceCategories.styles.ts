import { styled } from "tamagui";
import { YStack } from "tamagui";

export const CategoryContainer = styled(YStack, {
    rounded: '$6',
    backgroundColor: 'white',
    padding: 8,
    width: '100%',
    $lg: {
      width: '24%',
    },
  });
  
  export const CategoryInnerContainer = styled(YStack, {
    rounded: '$5',
    backgroundColor: 'white',
    padding: '$4',
    width: '100%',
    bg: '#EDF1F8',
  });