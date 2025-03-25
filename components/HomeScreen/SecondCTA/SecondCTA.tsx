import React from 'react';
import { YStack, Button, XStack, View, styled, useMedia } from 'tamagui';
import { MyXStack, MyText } from '@/components/shared';
import { BedDouble, MousePointerClick, Clock, Wallet, RefreshCcw } from '@tamagui/lucide-icons';
import { IconContainer } from '@/components/ui';

export const SecondCTA = () => {
  const media = useMedia();

  return (
    <MyXStack p={'$4'}>
      <YStack width="100%" bg="$blue12" p="$6" rounded="$5" gap="$4">
        <XStack width={'100%'} gap="$4">
          <CTA showButton={media.lg} />
          {media.lg && <Elements />}
        </XStack>
        {!media.lg && (
          <>
            <Elements />
            <Button bg="$blue10" rounded="$5" p="$4" width={'100%'}>
              <MyText color="white" fw="bold">
                Използвай Сега
              </MyText>
            </Button>
          </>
        )}
      </YStack>
    </MyXStack>
  );
};

const Elements = () => {
  return (
    <XStack
      width="100%"
      flexWrap="wrap"
      $lg={{
        width: '60%',
      }}
      gap="$2"
    >
      {ELEMENTS.map(el => {
        return (
          <ElementContainer key={el.title}>
            {el.icon()}
            <MyText color="white" fw="bold" size="$6">
              {el.title}
            </MyText>
            <MyText color="white">{el.description}</MyText>
          </ElementContainer>
        );
      })}
    </XStack>
  );
};

const CTA = ({ showButton }: { showButton?: boolean }) => {
  return (
    <YStack width="100%" $lg={{ width: '40%' }} gap="$4" p="$2" justify={'center'}>
      <XStack items="center" gap="$2">
        <IconContainer>
          <BedDouble size={12} />
        </IconContainer>
        <MyText color="white" size="#2" fw="bold">
          Бързо обзавеждане
        </MyText>
      </XStack>
      <MyText color="white" size="$9" fw="bold">
        Безпроблени продажби с виртуално обазавеждане
      </MyText>
      <MyText color="white">
        Вижте защо ние сме най-бързо развиващата се компания за виртуално обзавеждане.
      </MyText>
      {showButton && (
        <Button bg="$blue10" rounded="$5" p="$4" width={'100%'}>
          <MyText color="white" fw="bold">
            Използвай Сега
          </MyText>
        </Button>
      )}
    </YStack>
  );
};

export const ElementContainer = styled(View, {
  bg: '#001B3A',
  width: '100%',
  $md: {
    width: '48%',
  },
  gap: '$3',
  p: '$4',
  content: 'center',
  rounded: '$4',
});

const ELEMENTS = [
  {
    title: 'Лесен за използване',
    description: 'Премахнете съществуващите мебели и добавете нови с едно натискане на бутон.',
    icon: () => <MousePointerClick size={20} color="$green8" />,
  },
  {
    title: 'Най-ниска цена',
    description:
      'За само $16 на месец можете виртуално да поставите 6 изображения – по-евтино от повечето агенции за едно.',
    icon: () => <Wallet size={20} color="$green8" />,
  },
  {
    title: 'Незабавни резултати',
    description: 'Вземете снимките си готови за обява само за 15 секунди.',
    icon: () => <Clock size={20} color="$green8" />,
  },
  {
    title: 'Неограничени регенерации',
    description:
      'Имахте нещо друго предвид? Получете повече дизайни за секунди без да ходите напред-назад с дизайнер.',
    icon: () => <RefreshCcw size={20} color="$green8" />,
  },
];
