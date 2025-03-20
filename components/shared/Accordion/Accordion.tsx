import React from 'react';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Accordion as TamaguiAccordion, Square } from 'tamagui';
import { MyText } from '../MyText/MyText';

export function Accordion({
  items,
}: {
  items: { id: number; title: string; description: string }[];
}) {
  return (
    <TamaguiAccordion
      type="multiple"
      collapsable={true}
      overflow="hidden"
      width="100%"
      position="relative"
    >
      {items.map(item => (
        <TamaguiAccordion.Item key={item.id} value={`a${item.id}`}>
          <TamaguiAccordion.Trigger
            flexDirection="row"
            justifyContent="space-between"
            bg="$white2"
            borderLeftWidth={0}
            borderRightWidth={0}
            borderTopWidth={0}
            hoverStyle={{ backgroundColor: '$white2' }}
          >
            {({ open }: { open: boolean }) => (
              <>
                <MyText fw="bold" text="left">
                  {item.title}
                </MyText>
                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="$1" />
                </Square>
              </>
            )}
          </TamaguiAccordion.Trigger>

          <TamaguiAccordion.HeightAnimator animation="medium">
            <TamaguiAccordion.Content
              animation="medium"
              bg="transparent"
              exitStyle={{ opacity: 0 }}
            >
              <MyText>{item.description}</MyText>
            </TamaguiAccordion.Content>
          </TamaguiAccordion.HeightAnimator>
        </TamaguiAccordion.Item>
      ))}
    </TamaguiAccordion>
  );
}
