import React, { useEffect, useState } from 'react';
import { Input, Button, YStack, XStack, styled } from 'tamagui';
import { MyText, MyYStack } from '@/components/shared';
import { useToastController } from '@tamagui/toast';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { CircleMinus, CheckCircle, Square, SquareCheckBig } from '@tamagui/lucide-icons';
import { createCustomer } from '@/services';
import { useAuthStore } from '@/stores';

export default function RegistrationScreen() {
  const { setCustomer } = useAuthStore();

  const toast = useToastController();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  //password validation
  const [passwordIsEightChars, setPasswordIsEightChars] = useState(false);
  const [passwordHasUppercase, setPasswordHasUppercase] = useState(false);
  const [passwordHasLowercase, setPasswordHasLowercase] = useState(false);
  const [passwordHasNumber, setPasswordHasNumber] = useState(false);
  const [passwordHasSpecialChar, setPasswordHasSpecialChar] = useState(false);

  const [confirmConditions, setConfirmConditions] = useState(false);

  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (!email) {
      return setEmailError('Моля въведете email');
    }

    if (!password) {
      return setPasswordError('Моля въведете парола');
    }

    if (
      !passwordIsEightChars ||
      !passwordHasUppercase ||
      !passwordHasLowercase ||
      !passwordHasNumber ||
      !passwordHasSpecialChar
    ) {
      return setPasswordError(
        'Паролата трябва да бъде поне 8 символа, да съдържа главна и малка буква, цифра и специален символ'
      );
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log('error', error);
      return setError(error.message);
    }

    if (authData.user && authData.session) {
      const { error, data: customerResponse } = await createCustomer(
        authData.session?.access_token,
        email,
        authData.user.id
      );

      if (error || !customerResponse) {
        return console.error(error ? error : 'No customer response on register');
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
    password.length >= 8 ? setPasswordIsEightChars(true) : setPasswordIsEightChars(false);

    password.match(/[A-Z]/) ? setPasswordHasUppercase(true) : setPasswordHasUppercase(false);

    password.match(/[a-z]/) ? setPasswordHasLowercase(true) : setPasswordHasLowercase(false);

    password.match(/\d/) ? setPasswordHasNumber(true) : setPasswordHasNumber(false);

    password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      ? setPasswordHasSpecialChar(true)
      : setPasswordHasSpecialChar(false);
  }, [password]);

  return (
    <MyYStack justify="center" items="center">
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
        <XStack flexWrap="wrap" gap="$2">
          <PasswordRequirementContainer>
            {passwordIsEightChars ? (
              <CheckCircle size={16} color="$green10" />
            ) : (
              <CircleMinus size={16} color="black" />
            )}
            <MyText
              size="$2"
              color={passwordIsEightChars ? '$green10' : 'black'}
              opacity={password.length > 0 || passwordIsEightChars ? 1 : 0.7}
            >
              поне 8 символа
            </MyText>
          </PasswordRequirementContainer>

          <PasswordRequirementContainer>
            {passwordHasUppercase ? (
              <CheckCircle size={16} color="$green10" />
            ) : (
              <CircleMinus size={16} color="black" />
            )}
            <MyText
              size="$2"
              color={passwordHasUppercase ? '$green10' : 'black'}
              opacity={password.length > 0 || passwordHasUppercase ? 1 : 0.7}
            >
              главна буква
            </MyText>
          </PasswordRequirementContainer>

          <PasswordRequirementContainer>
            {passwordHasLowercase ? (
              <CheckCircle size={16} color="$green10" />
            ) : (
              <CircleMinus size={16} color="black" />
            )}
            <MyText
              size="$2"
              color={passwordHasLowercase ? '$green10' : 'black'}
              opacity={password.length > 0 || passwordHasLowercase ? 1 : 0.7}
            >
              малка буква
            </MyText>
          </PasswordRequirementContainer>

          <XStack alignItems="center" gap="$2">
            {passwordHasNumber ? (
              <CheckCircle size={16} color="$green10" />
            ) : (
              <CircleMinus size={16} color="black" />
            )}
            <MyText
              size="$2"
              color={passwordHasNumber ? '$green10' : 'black'}
              opacity={password.length > 0 || passwordHasNumber ? 1 : 0.7}
            >
              цифра
            </MyText>
          </XStack>

          <PasswordRequirementContainer>
            {passwordHasSpecialChar ? (
              <CheckCircle size={16} color="$green10" />
            ) : (
              <CircleMinus size={16} color="black" />
            )}
            <MyText
              size="$2"
              color={passwordHasSpecialChar ? '$green10' : 'black'}
              opacity={password.length > 0 || passwordHasSpecialChar ? 1 : 0.7}
            >
              специален символ
            </MyText>
          </PasswordRequirementContainer>
        </XStack>
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
    </MyYStack>
  );
}

const PasswordRequirementContainer = styled(XStack, {
  gap: '$2',
  alignItems: 'center',
});
