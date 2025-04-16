import React from 'react';
import { YStack, XStack, useMedia, View } from 'tamagui';
import { MyText, Accordion, MyYStack } from '@/components/shared';
import { MessageCircle } from '@tamagui/lucide-icons';
import { IconContainer } from '@/components/ui';

export const PricingFAQ = () => {
  const media = useMedia();

  return (
    <MyYStack>
      <XStack width={'100%'}>
        <YStack gap="$2" width="100%" items="center" $lg={{ width: '40%', items: 'flex-start' }}>
          <XStack items="center" gap="$2">
            <IconContainer>
              <MessageCircle size={16} color="white" />
            </IconContainer>
            <MyText fw="bold">FAQ</MyText>
          </XStack>

          <YStack gap="$1">
            <MyText size="$8" fw="bold">
              Имате въпроси?
            </MyText>
            <MyText size="$8">Ние имаме отговорите</MyText>
          </YStack>
        </YStack>

        {media.lg && (
          <YStack width="100%" $lg={{ width: '60%' }} rounded={'$6'} overflow="hidden">
            <Accordion items={FAQ_CONTENT} />
          </YStack>
        )}
      </XStack>
      {!media.lg && (
        <View width={'100%'} rounded={'$6'} overflow="hidden">
          <Accordion items={FAQ_CONTENT} />
        </View>
      )}
    </MyYStack>
  );
};

const FAQ_CONTENT = [
  {
    id: 1,
    title: 'Колко различни версии мога да създам за всяка снимка?',
    description:
      'Можете да качвате определен брой снимки на месец във Digital Estate според избрания от вас план. За всяка качена снимка можете да генерирате до 20 на брой различни версии/ визуализации. Свободни сте да изпробвате различни типове стаи и стилове на обзавеждане за всяка качена снимка без допълнително заплащане.',
  },
  {
    id: 2,
    title: 'Какво се случва с неизползваните кредити в края на всеки месец?',
    description:
      'Всеки месец можете да качвате толкова снимки, колкото са включени във вашия план. В случай че, не използвате всички снимки, те не се запазват за следващия месец.',
  },
  {
    id: 3,
    title: 'Мога ли да прекратя абонамента си по всяко време?',
    description:
      'Да, можете да прекратите абонамента си по всяко време, за да спрете всички бъдещи разходи.',
  },
  {
    id: 4,
    title: 'Мога ли да променя плана си по всяко време?',
    description:
      'Да, можете да надградите или понижите текущия си план по всяко време. При надграждане, плащате единствено разликата в цената между активния и новия план. При понижаване, новата цена влиза в сила от следващия отчетен период.',
  },
  {
    id: 5,
    title: 'Какво се случва, ако имам нужда да обработя повече снимки в даден месец?',
    description:
      'Можете да надградите плана си само за този месец и веднага след това да го понижите, промяната на плана няма да се отрази на оставащите ви снимки.',
  },
  {
    id: 6,
    title: 'Предлагате ли възстановяване на средства?',
    description:
      'Да, предлагаме пълно възстановяване на средствата ви в рамките на 7 дни, ако сте качили по-малко от 5 снимки на нашата платформа.',
  },
  {
    id: 7,
    title: 'Какви методи за плащане приемате?',
    description: 'Приемаме Visa, Mastercard, Google Pay и Apple Pay.',
  },
];
