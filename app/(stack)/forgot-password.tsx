import React, { useState } from 'react';
import { MinHeightWrapper, MyText, MyYStack } from '@/components/shared';
import { YStack, Input, Button, styled, Spinner } from 'tamagui';
import { supabase } from '@/lib/supabase';
import { useShowToast } from '@/hooks';

export default function ForgotPasswordScreen() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (!email) {
      return setError('Въведете email');
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://digital-estate.bg/create-new-password',
    });

    console.log("reset password data", data);
    

    if (error) {
      setIsLoading(false);
      setError(error.message);
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
      description: 'Проверете имейла си за инструкции',
      type: 'success',
    });
  };

  return (
    <MyYStack>
      <MinHeightWrapper>
        <YStack justify="center" items="center" gap="$4">
          <MyText type="title" fw="bold">
            Забравена Парола
          </MyText>

          <MyText>Ще получите инструкции като да създадете нова парола.</MyText>
          <InputContainer>
            <MyText fw="bold">Email</MyText>
            <Input value={email} onChangeText={setEmail} placeholder="Въведете email" />
            <>
              {error && (
                <MyText fw="bold" color="$red10">
                  {error}
                </MyText>
              )}
            </>
          </InputContainer>

          <Button width={'100%'} $lg={{ width: 500 }} bg="$blue10" onPress={onConfirm}>
            <MyText color="white" fw="bold">
              Изпрати
            </MyText>
            {isLoading && <Spinner color="white" />}
          </Button>
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
