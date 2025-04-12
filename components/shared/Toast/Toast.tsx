import { Toast, useToastController, useToastState } from '@tamagui/toast';
import React from 'react';
import { YStack } from 'tamagui';

export const MyToast = () => {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  const type = currentToast?.extra?.type as 'success' | 'error' | 'info';

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return '$green10';
      case 'error':
        return '$red10';
      case 'info':
      default:
        return 'gray';
    }
  };

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
      viewportName={currentToast.viewportName}
      p="$3"
      bg={getToastColor()}
      borderRadius="$4"
      maxWidth={320}
    >
      <YStack>
        <Toast.Title size="$6" fontWeight="bold" color="white">
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description size="$6" color="white">
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  );
};
