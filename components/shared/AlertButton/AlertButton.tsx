import React from 'react';
import {
  AlertDialog as TamaguiAlertDialog,
  Button,
  XStack,
  YStack,
  Variable,
  Spinner,
} from 'tamagui';
import { MyText } from '../MyText/MyText';

type Props = {
  buttonText: string;
  buttonColor?: Variable | string;
  buttonTextColor?: Variable | string;
  title: string;
  description?: string;
  onConfirmText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export const AlertButton = ({
  title,
  buttonText,
  buttonColor,
  buttonTextColor,
  description,
  onConfirmText,
  onConfirm,
  isLoading,
}: Props) => {
  return (
    <TamaguiAlertDialog native>
      <TamaguiAlertDialog.Trigger asChild>
        <Button bg={buttonColor ?? '$blue10'}>
          <MyText fw="bold" color={buttonTextColor ?? 'white'}>
            {buttonText}
          </MyText>
          {isLoading && <Spinner color={buttonTextColor ?? 'white'} />}
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
            <TamaguiAlertDialog.Title size="$7" fw="bold">
              {title}
            </TamaguiAlertDialog.Title>
            {description && (
              <TamaguiAlertDialog.Description size="$4">
                {description}
              </TamaguiAlertDialog.Description>
            )}

            <XStack gap="$3" justifyContent="flex-end">
              <TamaguiAlertDialog.Cancel asChild>
                <Button fw="bold">Откажи</Button>
              </TamaguiAlertDialog.Cancel>
              <TamaguiAlertDialog.Action asChild>
                <Button theme="accent" onPress={onConfirm}>
                  <MyText fw="bold" color={'white'}>
                    {onConfirmText ?? 'Потвърди'}
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
