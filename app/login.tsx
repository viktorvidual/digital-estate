import React, { useState, useEffect } from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { YStack, Input, Button, XStack, styled } from 'tamagui';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (!email) {
      return setEmailError('Въведете email');
    }

    if (!password) {
      return setPasswordError('Въведете парола');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('not confirmed')) {
        return setError('Вашият имейл не е потвърден');
      } else if (error.message.toLowerCase().includes('invalid login credentials')) {
        return setError('Невалидни данни');
      } else {
        return setError(error.message);
      }
    }

    if (data) {
      router.navigate('/');
    }
  };

  useEffect(() => {
    if (emailError) {
      setEmailError('');
    }

    if (passwordError) {
      setPasswordError('');
    }

    if (error) {
      setError('');
    }
  }, [email, password]);

  return (
    <MyYStack justify="center" items="center">
      <MyText type="title" fw="bold">
        Вход
      </MyText>

      <InputContainer>
        <MyText fw="bold">Email</MyText>
        <Input value={email} onChangeText={setEmail} placeholder="Въведете email" />
        {emailError && (
          <MyText fw="bold" color="$red10">
            {emailError}
          </MyText>
        )}
      </InputContainer>

      <InputContainer>
        <MyText fw="bold">Парола</MyText>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Изберете парола"
          secureTextEntry
        />
        {passwordError && (
          <MyText fw="bold" color="$red10">
            {passwordError}
          </MyText>
        )}
      </InputContainer>

      <XStack width={'100%'} $lg={{ width: 500 }} alignItems="center" gap="$2">
        <Link href="/">
          <MyText>Забравена парола?</MyText>
        </Link>
      </XStack>

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

const InputContainer = styled(YStack, {
  width: '100%',
  gap: '$2',
  $lg: {
    width: 500,
  },
});
