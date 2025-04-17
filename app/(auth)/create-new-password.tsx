import React, { useEffect, useState } from 'react';
import { styled, YStack, Input, Button, Spinner } from 'tamagui';
import { MyYStack, MyText } from '@/components/shared';
import { useShowToast } from '@/hooks';
import { supabase } from '@/lib/supabase';

export default function CreateNewPasswordScreen() {
  const showToast = useShowToast();

  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onConfirm = async () => {
    if (!password) {
      return setPasswordError('Въведете парола');
    }

    if (password !== confirmPassword) {
      return showToast({
        title: 'Грешка',
        description: 'Паролите не съвпадат',
        type: 'error',
      });
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setIsLoading(false);
      console.log(error);

      return showToast({
        title: 'Грешка',
        description: error.message,
        type: 'error',
      });
    }

    setIsLoading(false);
    showToast({
      title: 'Успешно',
      description: 'Паролата е променена успешно',
      type: 'success',
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.substring(1); // Remove the '#' at the start
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            showToast({
              title: 'Грешка',
              description: error.message,
              type: 'error',
            });
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      showToast({
        title: 'Грешка',
        description: 'Липсват токени в URL адреса',
        type: 'error',
      });

      setIsLoading(false);
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

  return (
    <MyYStack justify="center" items="center">
      <InputContainer>
        <MyText fw="bold">Парола</MyText>
        <Input value={password} onChangeText={setPassword} placeholder="Въведете нова парола" />
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
        />
        <>
          {confirmPasswordError && (
            <MyText fw="bold" color="$red10">
              {confirmPasswordError}
            </MyText>
          )}
        </>
      </InputContainer>
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
