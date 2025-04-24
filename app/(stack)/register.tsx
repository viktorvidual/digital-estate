import React, { useEffect, useState } from 'react';
import { Input, Button, YStack, XStack, getTokens } from 'tamagui';
import { MyText, MyYStack } from '@/components/shared';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Square, SquareCheckBig } from '@tamagui/lucide-icons';
import { createCustomer } from '@/services';
import { useAuthStore } from '@/stores';
import { useShowToast } from '@/hooks';
import { validatePassword } from '@/utils';
import { PasswordRequirements } from '@/constants';
import { PasswordRequirements as PasswordRequirementsComponent } from '@/components/RegisterScreen';

export default function RegistrationScreen() {
  const { setCustomer } = useAuthStore();

  const showToast = useShowToast();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  //password validation
  const [passwordRequirements, setPasswordRequirements] = useState([...PasswordRequirements]);

  const [confirmConditions, setConfirmConditions] = useState(false);

  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (!email) {
      return setEmailError('Моля въведете email');
    }

    if (!password) {
      return setPasswordError('Моля въведете парола');
    }

    if (passwordRequirements.some(requirement => requirement.isValid === false)) {
      return setPasswordError(
        'Паролата трябва да бъде поне 8 символа, да съдържа главна и малка буква, цифра и специален символ'
      );
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return setError('Имейлът вече е регистриран');
      } else if (error.message.toLowerCase().includes('invalid email')) {
        return setError('Невалиден имейл');
      }

      return setError(error.message);
    }

    showToast({
      title: 'Успешна Регистрация',
      description: 'Вече сте логнати в приложението',
      duration: 5000,
      type: 'success',
    });

    if (authData.user && authData.session) {
      const { error, data: customerResponse } = await createCustomer(
        authData.session?.access_token,
        email,
        authData.user.id
      );

      if (error || !customerResponse) {
        const errorMessage = error || 'No customer response on register';
        return setError(errorMessage);
      }

      setCustomer(customerResponse);
    } else {
      console.log('Auth User Or Auth Session not Available');
    }
  };

  useEffect(() => {
    if (error) {
      setError('');
    }

    if (emailError) {
      setEmailError('');
    }

    if (passwordError) {
      setPasswordError('');
    }

    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  }, [email, password]);

  useEffect(() => {
    const result = validatePassword(password);
    setPasswordRequirements(result);
  }, [password]);

  return (
    <MyYStack justify="center" items="center">
      <div
        style={{
          minHeight: '79vh',
        }}
      >
        <YStack gap="$4">
          <MyText type="title" fw="bold">
            Регистрация
          </MyText>

          <YStack width={'100%'} gap="$2" $lg={{ width: 500 }}>
            <MyText fw="bold">Email</MyText>

            <Input value={email} onChangeText={setEmail} placeholder="Въведете email" />
            <>
              {emailError && (
                <MyText fw="bold" color="$red10">
                  {emailError}
                </MyText>
              )}
            </>
          </YStack>

          <YStack width={'100%'} gap="$2" $lg={{ width: 500 }}>
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
          </YStack>

          <XStack
            width={'100%'}
            $lg={{ width: 500 }}
            alignItems="center"
            gap="$2"
            onPress={() => setConfirmConditions(!confirmConditions)}
            cursor="pointer"
          >
            {confirmConditions ? (
              <SquareCheckBig size={16} color="$green10" />
            ) : (
              <Square size={16} color="black" />
            )}
            <MyText size="$4">Прочетох и съм съгласен с Общите условия</MyText>
          </XStack>

          <YStack width={'100%'} $lg={{ width: 500 }} my="$1">
            <MyText fw="bold" size="$2" mb="$1">
              Парола трябва да съдържа:
            </MyText>
            <PasswordRequirementsComponent passwordRequirements={passwordRequirements} />
          </YStack>

          <>
            {error && (
              <MyText fw="bold" color="$red10">
                {error}
              </MyText>
            )}
          </>

          <Button
            width={'100%'}
            $lg={{ width: 500 }}
            bg={confirmConditions ? '$blue10' : '$blue6'}
            onPress={onConfirm}
            disabled={!confirmConditions}
          >
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
        </YStack>
      </div>
    </MyYStack>
  );
}
