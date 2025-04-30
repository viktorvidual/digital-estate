import React, { useState, useEffect } from 'react';
import { MyText, MyYStack, MinHeightWrapper } from '@/components/shared';
import { YStack, Input, Button, XStack, styled, Spinner } from 'tamagui';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useShowToast } from '@/hooks';
import { router } from 'expo-router';

export default function LoginScreen() {
  const showToast = useShowToast();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (isLoading) {
      return;
    } else if (!email) {
      return setEmailError('Въведете email');
    } else if (!password) {
      return setPasswordError('Въведете парола');
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('not confirmed')) {
          throw new Error('Потвърдете email адреса си');
        } else if (error.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Невалидни входни данни');
        } else {
          throw new Error(error.message);
        }
      }

      showToast({
        title: 'Успешно влязохте',
        type: 'success',
      });
      router.replace('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Грешка при вход';
      setError(errorMessage);
      showToast({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
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
      <MinHeightWrapper>
        <YStack gap="$4">
          <MyText type="title" fw="bold">
            Вход
          </MyText>

          <InputContainer>
            <MyText fw="bold">Email</MyText>
            <Input value={email} onChangeText={setEmail} placeholder="Въведете email" />
            <>
              {emailError && (
                <MyText fw="bold" color="$red10">
                  {emailError}
                </MyText>
              )}
            </>
          </InputContainer>

          <InputContainer>
            <MyText fw="bold">Парола</MyText>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Изберете парола"
              secureTextEntry
            />
            <>
              {passwordError && (
                <MyText fw="bold" color="$red10">
                  {passwordError}
                </MyText>
              )}
            </>
          </InputContainer>

          <XStack width={'100%'} $lg={{ width: 500 }} alignItems="center" gap="$2">
            <Link href="/forgot-password">
              <MyText color="$blue10">Забравена парола?</MyText>
            </Link>
          </XStack>

          <Button width={'100%'} $lg={{ width: 500 }} bg="$blue10" onPress={onConfirm}>
            <MyText color="white" fw="bold">
              Вход
            </MyText>
            {isLoading && <Spinner color="white" />}
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
        </YStack>
      </MinHeightWrapper>
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
