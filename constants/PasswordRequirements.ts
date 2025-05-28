export type PasswordRequirement = {
  isValid: boolean;
  message: string;
};

export const PasswordRequirements: PasswordRequirement[] = [
  {
    isValid: false,
    message: 'Поне 8 символа',
  },
  {
    isValid: false,
    message: 'Главна буква',
  },
  {
    isValid: false,
    message: 'Малка буква',
  },
  {
    isValid: false,
    message: 'Цифра',
  },
  {
    isValid: false,
    message: 'Специален символ',
  },
];
