import { PasswordRequirement } from '@/constants';

export const validatePassword = (password: string): PasswordRequirement[] => {
  return [
    {
      isValid: password.length >= 8,
      message: 'Поне 8 символа',
    },
    {
      isValid: /[A-Z]/.test(password),
      message: 'Главна буква',
    },
    {
      isValid: /[a-z]/.test(password),
      message: 'Малка буква',
    },
    {
      isValid: /\d/.test(password),
      message: 'Цифра',
    },
    {
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: 'Специален символ',
    },
  ];
};
