import React, { useEffect, useState } from 'react';
import { MyYStack, MyText } from '@/components/shared';
import { Wallet } from '@tamagui/lucide-icons';
import { IconContainer } from '@/components/ui';
import { styled, View, XStack, YStack, useMedia } from 'tamagui';

export const PricingHeader = () => {
  const [selected, setSelected] = useState<string>('monthly');

  const media = useMedia();

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <MyYStack zIndex={'$2'} py="$6">
      <XStack
        gap="$3"
        content="center"
        alignSelf="center"
        $lg={{
          alignSelf: 'flex-start',
        }}
      >
        <IconContainer>
          <Wallet size={16} />
        </IconContainer>
        <MyText size="$2" color="white" fw="bold">
          Прекрати по всяко време
        </MyText>
      </XStack>

      {!media.lg ? (
        <YStack width="100%" items="center" gap="$3">
          <Content selected={selected} setSelected={setSelected} />
        </YStack>
      ) : (
        <XStack width="100%" items="center" justify="space-between">
          <Content selected={selected} setSelected={setSelected} />
        </XStack>
      )}

      <XStack width="100%" items="center" justify="space-between"></XStack>
    </MyYStack>
  );
};

const Content = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (selected: string) => void;
}) => {
  const media = useMedia();

  return (
    <>
      <YStack gap="$3">
        <MyText
          color="white"
          type="title"
          fw="bold"
          text="center"
          $lg={{
            text: 'left',
          }}
        >
          Цените на нашите планове
        </MyText>
        <MyText
          text="center"
          $lg={{
            text: 'left',
          }}
          color="white"
        >
          Изберете правилния план за вас и вашият бизнес.
        </MyText>
      </YStack>

      <ToggleContainer>
        <ToggleItem selected={selected === 'monthly'} onPress={() => setSelected('monthly')}>
          <MyText color={selected === 'monthly' ? 'black' : 'white'} fw="bold">
            Месечно
          </MyText>
        </ToggleItem>

        <ToggleItem selected={selected === 'yearly'} onPress={() => setSelected('yearly')} gap="$2">
          <MyText color={selected === 'yearly' ? 'black' : 'white'} fw="bold">
            Годишно
          </MyText>
          <View bg="$green10" borderRadius="$10" paddingHorizontal="$3" paddingVertical="$1">
            <MyText fw="bold" color="white">
              До -50%
            </MyText>
          </View>
        </ToggleItem>
      </ToggleContainer>
    </>
  );
};

const ToggleContainer = styled(XStack, {
  borderRadius: '$10',
  backgroundColor: '#141A2F',
});

const ToggleItem = styled(XStack, {
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
