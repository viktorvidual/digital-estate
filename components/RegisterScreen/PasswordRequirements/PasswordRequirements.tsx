import React from 'react';
import { PasswordRequirementContainer } from './PasswordRequirements.styles';
import { PasswordRequirement } from '@/constants';
import { XStack } from 'tamagui';
import { CircleMinus, CheckCircle } from '@tamagui/lucide-icons';
import { MyText } from '@/components/shared';

type Props = {
  passwordRequirements: PasswordRequirement[];
};

export const PasswordRequirements = ({ passwordRequirements: PasswordRequirmentsBase }: Props) => {
  return (
    <XStack flexWrap="wrap" gap="$2">
      {PasswordRequirmentsBase.map((requirement: PasswordRequirement, index: number) => {
        return (
          <PasswordRequirementContainer key={index}>
            {requirement.isValid ? (
              <CheckCircle color="$green10" size={16} />
            ) : (
              <CircleMinus size={16} color="black" />
            )}
            <MyText>{requirement.message}</MyText>
          </PasswordRequirementContainer>
        );
      })}
    </XStack>
  );
};
