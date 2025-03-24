import React, { useState } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { YStack, Input, Button, XStack } from 'tamagui';
import { Link } from 'expo-router';
import { useToastController } from '@tamagui/toast';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function LoginScreen() {
  const toast = useToastController();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (!email || !password) {
      return setError('Всички полета са задължителни');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('not confirmed')) {
        setError('Вашият имейл не е потвърден');
      } else {
        setError(error.message);
      }
    }

    if (data) {
      router.navigate('/');
      toast.show('Успешен вход');
    }
  };

  return (
    <MyYStack justify="center" items="center" gap="$4">
      <MyText type="title" fw="bold">
        Вход
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

      <Button width={'100%'} $lg={{ width: 500 }} bg="$blue10" onPress={onConfirm}>
        <MyText color="white" fw="bold">
          Вход
        </MyText>
      </Button>

      <>
        {error && (
          <MyText fw="bold" color="$red10">
            {error}
          </MyText>
        )}
      </>

      <XStack>
        <MyText>Нямаш профил? </MyText>
        <Link href="/register">
          <MyText color="$blue10">Регистрирай се</MyText>
        </Link>
      </XStack>
    </MyYStack>
  );
}
