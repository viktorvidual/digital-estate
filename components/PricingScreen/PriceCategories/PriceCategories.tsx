import React, { useEffect, useState } from 'react';
import { usePricingStore } from '@/stores';
import { MyText, MyXStack } from '@/components/shared';
import { useMedia, YStack, XStack, Button } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import { ENDPOINTS } from '@/constants';
import { useAuthStore } from '@/stores';
import { router } from 'expo-router';
import { getStripePortalUrl } from '@/services';
import { CategoryContainer, CategoryInnerContainer } from './PriceCategories.styles';
import { supabase } from '@/lib/supabase';
import { PriceCategory } from '@/types';

export const PriceCategories = () => {
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>([]);

  useEffect(() => {
    (async () => {
      const { error, data } = await supabase.from('prices').select('*');

      if (error) {
        console.error('Error fetching prices:', error);
      } else if (data) {
        setPriceCategories(data);
      }
    })();
  }, []);

  return (
    <MyXStack justify="space-between" flexWrap="wrap" gap="$3">
      {priceCategories.map(category => (
        <Category key={category.name} category={category} />
      ))}
    </MyXStack>
  );
};

const Category = ({ category }: { category: PriceCategory }) => {
  const { session, customer } = useAuthStore();

  const media = useMedia();

  const { selectedPricing } = usePricingStore();

  const priceBgn = selectedPricing === 'monthly' ? category.monthlyBgn : category.yearlyBgn;
  const priceEur = selectedPricing === 'monthly' ? category.monthlyEur : category.yearlyEur;
  const stripePriceId =
    selectedPricing === 'monthly' ? category.stripeMonthlyPriceId : category.stripeYearlyPriceId;

  const onChangeSubscription = async () => {
    const accessToken = session?.access_token;
    const stripeUserId = customer?.stripeCustomerId;

    if (accessToken && stripeUserId) {
      const { error, data } = await getStripePortalUrl(stripeUserId, accessToken);

      if (error || !data) {
        return console.log(error || 'No Url provided from get stripe portal url');
      }

      window.location.href = data.url;
    } else {
      console.error('Stripe userid or access token not availabes');
    }
  };

  const onPress = async (stripePriceId: string) => {
    if (!session) {
      router.navigate('/login');
    }

    try {
      console.log(stripePriceId, 'stripe price id');

      const response = await fetch(ENDPOINTS.CREATE_CHECKOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ stripePriceId, stripeCustomerId: customer?.stripeCustomerId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Checkout error:', data.error);
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  return (
    <CategoryContainer>
      <CategoryInnerContainer>
        <MyText size="$6" fw="bold">
          {category.name}
        </MyText>

        <MyText size="$4">{category.subtitle}</MyText>

        <YStack>
          {!priceBgn && (
            <MyText mt="$4" mb={-10} fw="bold">
              Повече от
            </MyText>
          )}
          <XStack mt="$3" gap="$2" alignItems="center">
            <MyText fw="bold" type="title">
              {category.photos}
            </MyText>
            <MyText fw="medium">снимки / месец</MyText>
          </XStack>
        </YStack>

        <XStack width={'100%'} justify={'space-between'}>
          {priceBgn && category.photos && (
            <YStack>
              <XStack mt="$3" gap="$2" alignItems="center">
                <MyText fw="bold" size="$8">
                  {priceBgn}лв / {priceEur}€
                </MyText>
                <MyText fw="medium">/ месец</MyText>
              </XStack>
              <XStack mt="$3" gap="$2" alignItems="center">
                <MyText size="$4">{(priceBgn / category.photos).toFixed(2)}лв</MyText>
                <MyText size="$4">/ снимка</MyText>
              </XStack>
            </YStack>
          )}

          {!media.lg && selectedPricing === 'monthly' && (
            <YStack mt="$3" alignSelf="center" bg="$blue12" p="$2" rounded="$6" items={'center'}>
              <MyText size="$3" color="white">
                Само{' '}
                <MyText fw="bold" color="white">
                  {category.yearlyBgn}лв / {category.yearlyEur}€
                </MyText>{' '}
              </MyText>
              <MyText size="$3" color="white">
                {' '}
                (м. с год. план)
              </MyText>
            </YStack>
          )}
        </XStack>

        {selectedPricing === 'monthly' && media.lg && (
          <XStack mt="$3" alignSelf="center" bg="$blue12" p="$1" px={12} rounded="$6">
            <MyText size="$3" color="white">
              Само{' '}
              <MyText fw="bold" color="white">
                {category.yearlyBgn}лв
              </MyText>{' '}
              (с год. план)
            </MyText>
          </XStack>
        )}

        {!priceBgn ? (
          <>
            <Button
              mt="$3"
              bg="$blue10"
              borderRadius="$10"
              width={'100%'}
              rounded="$6"
              onPress={() => {
                router.navigate('/contacts');
              }}
            >
              <MyText fw="bold" color="white">
                Свържи се с нас
              </MyText>
            </Button>
          </>
        ) : customer?.stripeSubscriptionStatus === 'active' ? (
          <>
            <Button
              mt="$3"
              bg="$blue10"
              borderRadius="$10"
              width={'100%'}
              rounded="$6"
              onPress={onChangeSubscription}
            >
              <MyText fw="bold" color="white">
                Промени План
              </MyText>
            </Button>
          </>
        ) : (
          <>
            <Button
              mt="$3"
              bg="$blue10"
              borderRadius="$10"
              width={'100%'}
              rounded="$6"
              onPress={() => onPress(stripePriceId as string)}
            >
              <MyText fw="bold" color="white">
                Избери
              </MyText>
            </Button>
          </>
        )}
      </CategoryInnerContainer>
      {media.lg && <Benefits />}
    </CategoryContainer>
  );
};

const Benefits = () => {
  return (
    <YStack p="$3" gap={'$2'}>
      {BENEFITS.map(benefit => (
        <XStack key={benefit} alignItems="center" gap="$2">
          <Check size={12} color="$blue10" />
          <MyText size="$4" fw="medium">
            {benefit}
          </MyText>
        </XStack>
      ))}
    </YStack>
  );
};

const BENEFITS = [
  'До 20 визуализации',
  'Всички стилове обзавеждане',
  'Всички видове стаи',
  'Премахване на мебели',
  '20 секунди време за обработка',
  'Безкраен достъп до изображенията',
];
