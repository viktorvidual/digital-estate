import React, { useState } from 'react';
import { Input, Button, YStack, XStack } from 'tamagui';
import { MyText, MyYStack } from '@/components/shared';
import { useToastController } from '@tamagui/toast';
import { Link } from 'expo-router';

export default function RegistrationScreen() {
  const toast = useToastController();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onConfirm = () => {
    console.log('email', email);
    console.log('password', password);
    console.log('confirm password', confirmPassword);

    toast.show('Welcome');
  };

  return (
    <MyYStack justify="center" items="center" gap="$4">
      <MyText type="title" fw="bold">
        Регистрация
      </MyText>
      <YStack width={'100%'} gap="$2" $lg={{ width: 500 }}>
        <MyText fw="bold">Email</MyText>
        <Input value={email} onChangeText={setEmail} placeholder="Въведете email" />
      </YStack>

      <YStack width={'100%'} gap="$2" $lg={{ width: 500 }}>
        <MyText fw="bold">Парола</MyText>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Изберете парола"
          secureTextEntry
        />
      </YStack>

      <YStack width={'100%'} gap="$2" $lg={{ width: 500 }}>
        <MyText fw="bold">Потвърди Парола</MyText>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Потвърдете паролата"
          secureTextEntry
        />
      </YStack>

      <Button width={'100%'} $lg={{ width: 500 }} bg="$blue10" onPress={onConfirm}>
        <MyText color="white" fw="bold">
          Регистрирай се
        </MyText>
      </Button>

      <XStack>
        <MyText>Вече имаш профил? </MyText>
        <Link href="/login">
          <MyText color="$blue10">Вход</MyText>
        </Link>
      </XStack>
    </MyYStack>
  );
}
