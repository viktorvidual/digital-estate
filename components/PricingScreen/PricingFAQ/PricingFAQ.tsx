import React from 'react';
import { YStack, XStack, useMedia } from 'tamagui';
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
              <MessageCircle size={16} color="white"/>
            </IconContainer>
            <MyText fw="bold">FAQ</MyText>
          </XStack>

          <YStack gap="$1">
            <MyText type="title" fw="bold">
              Имате въппроси?
            </MyText>
            <MyText type="title">Имаме отговорите</MyText>
          </YStack>
        </YStack>

        {media.lg && (
          <YStack width="100%" $lg={{ width: '60%' }}>
            <Accordion items={FAQ_CONTENT} />
          </YStack>
        )}
      </XStack>
      {!media.lg && <Accordion items={FAQ_CONTENT} />}
    </MyYStack>
  );
};

const FAQ_CONTENT = [
  {
    id: 1,
    title: 'Какво означава неограничени визуализации?',
    description:
      'Можете да качвате определен брой снимки на месец във Virtual Staging AI според избрания от вас план. За всяка качена снимка можете да генерирате неограничен брой сценични версии (визуализации). Свободни сте да изпробвате различни типове стаи и стилове на мебели за всяка качена снимка без допълнително заплащане.',
  },
  {
    id: 2,
    title: 'Какво се случва с неизползваните кредити в края на всеки месец?',
    description:
      'Всеки месец можете да качвате толкова снимки, колкото са включени във вашия план. Няма система за кредити, при която неизползваните кредити да се прехвърлят към следващия месец.',
  },
  {
    id: 3,
    title: 'Мога ли да отменя абонамента си по всяко време?',
    description: 'Да, можете да отмените абонамента си по всяко време, за да спрете бъдещи такси.',
  },
  {
    id: 4,
    title: 'Мога ли да сменям различни планове по всяко време?',
    description: 'Да, можете да надграждате или понижавате текущия си план по всяко време.',
  },
  {
    id: 5,
    title: 'Какво се случва, ако имам нужда да обработя повече снимки в даден месец?',
    description:
      'Можете да надградите плана си само за този месец и веднага след това да го понижите, за да качвате повече снимки през конкретния месец.',
  },
  {
    id: 6,
    title: 'Предлагате ли възстановяване на средства?',
    description:
      'Да, предлагаме пълно възстановяване в рамките на 7 дни, ако сте качили по-малко от 10 снимки на нашата платформа.',
  },
  {
    id: 7,
    title: 'Какви методи за плащане приемате?',
    description: 'Приемаме Visa, Mastercard, American Express, PayPal, Google Pay и Apple Pay.',
  },
];
