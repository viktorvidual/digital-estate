import React from 'react';
import { AlertDialog as TamaguiAlertDialog, Button, XStack, YStack, Variable } from 'tamagui';
import { MyText } from '../MyText/MyText';

type Props = {
  buttonText: string;
  buttonColor?: Variable | string;
  buttonTextColor?: Variable;
  title: string;
  description?: string;
  onConfirm: () => void;
};

export const AlertButton = ({
  title,
  buttonText,
  buttonColor,
  buttonTextColor,
  description,
  onConfirm,
}: Props) => {
  return (
    <TamaguiAlertDialog native>
      <TamaguiAlertDialog.Trigger asChild>
        <Button bg={buttonColor ?? '$blue10'}>
          <MyText fw="bold" color={buttonTextColor ?? 'white'}>
            {buttonText}
          </MyText>
        </Button>
      </TamaguiAlertDialog.Trigger>

      <TamaguiAlertDialog.Portal>
        <TamaguiAlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <TamaguiAlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$4">
            <TamaguiAlertDialog.Title fw="bold" size="$7">
              {title}
            </TamaguiAlertDialog.Title>
            {description && (
              <TamaguiAlertDialog.Description size="$4">{description}</TamaguiAlertDialog.Description>
            )}

            <XStack gap="$3" justifyContent="flex-end">
              <TamaguiAlertDialog.Cancel asChild>
                <Button fw="bold">Откажи</Button>
              </TamaguiAlertDialog.Cancel>
              <TamaguiAlertDialog.Action asChild>
                <Button theme="accent" onPress={onConfirm}>
                  <MyText fw="bold" color={buttonTextColor ?? 'white'}>
                    {buttonText ?? 'Потвърди'}
                  </MyText>
                </Button>
              </TamaguiAlertDialog.Action>
            </XStack>
          </YStack>
        </TamaguiAlertDialog.Content>
      </TamaguiAlertDialog.Portal>
    </TamaguiAlertDialog>
  );
};
