import React, { useEffect, useState } from 'react';
import { styled, YStack, Input, Button, Spinner } from 'tamagui';
import { MyYStack, MyText } from '@/components/shared';
import { useShowToast } from '@/hooks';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { PasswordRequirements } from '@/constants';
import { PasswordRequirements as PasswordRequirementsComponent } from '@/components/RegisterScreen';
import { validatePassword } from '@/utils';

export default function CreateNewPasswordScreen() {
  const showToast = useShowToast();

  const [passwordRequirements, setPasswordRequirements] = useState(PasswordRequirements);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onConfirm = async () => {
    if (!password) {
      return setPasswordError('Въведете парола');
    } else if (password !== confirmPassword) {
      throw new Error('Паролите не съвпадат');
    } else if (passwordRequirements.some(requirement => requirement.isValid === false)) {
      return setPasswordError(
        'Паролата трябва да бъде поне 8 символа, да съдържа главна и малка буква, цифра и специален символ'
      );
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      showToast({
        title: 'Успешно',
        description: 'Паролата е променена успешно',
        type: 'success',
      });

      router.replace('/');
    } catch (error) {
      console.log(error);
      showToast({
        title: 'Грешка',
        description: error instanceof Error ? error.message : 'Неочаквана грешка',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.substring(1); // Remove the '#' at the start
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      (async () => {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          return showToast({
            title: 'Грешка',
            description: error.message,
            type: 'error',
          });
        }

        showToast({
          title: 'Успешно',
          description: 'Въведете нова парола',
          type: 'success',
        });
      })();
    }
  }, []);

  useEffect(() => {
    if (passwordError) {
      setPasswordError('');
    }

    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    const result = validatePassword(password);
    setPasswordRequirements(result);
  }, [password]);

  return (
    <MyYStack justify="center" items="center">
      <MyText type="title" fw="bold">
        Създайте нова парола
      </MyText>
      <InputContainer>
        <MyText fw="bold">Парола</MyText>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Въведете нова парола"
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

      <InputContainer>
        <MyText fw="bold">Потвърдете Парола</MyText>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Потвърдете нова парола"
          secureTextEntry
        />
        <>
          {confirmPasswordError && (
            <MyText fw="bold" color="$red10">
              {confirmPasswordError}
            </MyText>
          )}
        </>
      </InputContainer>

      <YStack width={'100%'} $lg={{ width: 500 }} my="$1">
        <MyText fw="bold" size="$2" mb="$1">
          Парола трябва да съдържа:
        </MyText>
        <PasswordRequirementsComponent passwordRequirements={passwordRequirements} />
      </YStack>

      <Button width={'100%'} $lg={{ width: 500 }} bg="$blue10" onPress={onConfirm}>
        <MyText color="white" fw="bold">
          Смени Парола
        </MyText>
        {isLoading && <Spinner color="white" />}
      </Button>
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
