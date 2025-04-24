import React from 'react';
import { MyText, MyYStack } from '@/components/shared';
import { PrivacyPolicy } from '@/constants';

export default function PrivacyPolicyScreen() {
  return (
    <MyYStack>
      <MyText type="title" fw="bold">
        Политика за поверителност
      </MyText>
      <MyText>{PrivacyPolicy}</MyText>
    </MyYStack>
  );
}
