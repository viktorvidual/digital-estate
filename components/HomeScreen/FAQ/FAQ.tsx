import React from 'react';
import { YStack, XStack, useMedia } from 'tamagui';
import { MyText, Accordion, MyYStack } from '@/components/shared';
import { MessageCircle } from '@tamagui/lucide-icons';
import { IconContainer } from '@/components/ui';

export const FAQ = () => {
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
    title: 'Какво е виртуално обзавеждане?',
    description:
      'Виртуалното обзавеждане е достъпен метод за имотни агенти да направят имотите по-привлекателни за потенциални купувачи. Вместо да използват традиционни техники за обзавеждане, при които мебелите и декорите се пренасят и подреждат физически, се използва цифрова технология, за да се добавят мебели, декорации и други дизайнерски елементи към стаята. Това става чрез компютърен софтуер и 3D визуализация, създавайки виртуално представяне на напълно обзаведено и декорирано пространство.',
  },
  {
    id: 2,
    title: 'Защо да избера виртуално обзавеждане вместо физическо?',
    description:
      'Предимствата на виртуалното обзавеждане от гледна точка на икономията на разходи са очевидни. Без необходимостта от закупуване на мебели, наемане на декоратори, пренасяне на декорации и време за подреждане, виртуалното обзавеждане може значително да намали разходите в сравнение с традиционното обзавеждане с до 97%. Освен това виртуалното обзавеждане предлага повече гъвкавост – няма ограничения за стиловете на мебелите, които могат да бъдат добавени, тъй като виртуалните мебели могат да бъдат взети отвсякъде и добавени към дигиталните снимки.',
  },
  {
    id: 3,
    title: 'Какво е AI виртуално обзавеждане?',
    description:
      'AI виртуалното обзавеждане означава, че изкуствен интелект автоматично добавя мебели към снимка вместо човешки дизайнер. Чрез нашите модели за машинно обучение AI може да добави красиви, реалистични мебели с естествено осветление към всяка снимка на всекидневна или спалня, правейки го неразличимо от човешкото виртуално обзавеждане или физическото обзавеждане на дома. Освен това AI виртуалното обзавеждане е много по-бързо и намалява времето за изчакване от дни на секунди, както и разходите.',
  },
  {
    id: 4,
    title: 'Какви видове снимки поддържате?',
    description:
      'В момента поддържаме обзавеждане на всекидневни, спални, трапезарии, кухни, домашни офиси и бани, и скоро ще добавим още видове стаи. Предлагаме осем различни стила мебели, от които да избирате. Ако стаята вече има мебели или безпорядък, можем да почистим изображението преди да добавим новите мебели и ще получите снимка както на празната стая, така и на обзаведената.',
  },
  {
    id: 5,
    title: 'Колко време отнема AI виртуалното обзавеждане?',
    description:
      'Обработката на изображението и генерирането на виртуално обзаведена версия отнема около 10 секунди.',
  },
  {
    id: 6,
    title: 'Колко голяма е вашата библиотека с мебели?',
    description:
      'AI виртуалното обзавеждане не работи с предварително дефинирана библиотека с мебели. Алгоритъмът анализира всяка стая и генерира мебели, които най-добре пасват на стила и типа на стаята. Поради това никога две стаи няма да получат еднакви мебели.',
  },
];
