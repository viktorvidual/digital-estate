import React from 'react';
import { MyYStack, MyText } from '@/components/shared';
import { Wallet } from '@tamagui/lucide-icons';
import { IconContainer } from '@/components/ui';
import { styled, View, XStack, YStack, useMedia } from 'tamagui';
import { useAuthStore, usePricingStore } from '@/stores';

export const PricingHeader = () => {
  const media = useMedia();

  const { selectedPricing, setSelectedPricing } = usePricingStore();
  return (
    <MyYStack zIndex={'$2'} pt="$6" bg="$blue12">
      <XStack
        gap="$3"
        content="center"
        alignSelf="center"
        $lg={{
          alignSelf: 'flex-start',
        }}
      >
        <IconContainer>
          <Wallet size={16} color="white" />
        </IconContainer>
        <MyText size="$2" color="white" fw="bold">
          Прекрати по всяко време
        </MyText>
      </XStack>

      {!media.lg ? (
        <YStack width="100%" items="center" gap="$5" mb={-15}>
          <Content selected={selectedPricing} setSelected={setSelectedPricing} />
        </YStack>
      ) : (
        <XStack width="100%" items="center" justify="space-between">
          <Content selected={selectedPricing} setSelected={setSelectedPricing} />
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
  selected: 'monthly' | 'yearly';
  setSelected: (selected: 'monthly' | 'yearly') => void;
}) => {
  const { customer } = useAuthStore();

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

        {customer?.stripeSubscriptionStatus === 'active' && (

          <View bg="$green9" p="$3" rounded={'$4'}>
            <>
            <MyText
              text="center"
              $lg={{
                text: 'left',
              }}
              color="white"
              fw="bold"
              size={'$8'}
            >
              Активен План: {customer.stripePlanName} ({customer.stripePlanDescription}){' '}
              {customer.stripePlanInterval === 'month' ? 'месечен' : 'годишен'}
            </MyText>
            </>
          </View>
        )}
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
