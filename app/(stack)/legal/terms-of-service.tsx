import React from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { TermsOfService } from '@/constants';

export default function TermsOfServiceScreen() {
  return (
    <MyYStack>
      <MyText type="title" fw="bold">
        Условия за ползване
      </MyText>
      <MyText>{TermsOfService}</MyText>
    </MyYStack>
  );
}
