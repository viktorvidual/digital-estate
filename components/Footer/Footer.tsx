import React from 'react';
import { styled, XStack } from 'tamagui';

export const Footer = () => {
  return <Container p="$4" bg="$blue12"></Container>;
};

const Container = styled(XStack, {
  backgroundColor: '$blue12',
  padding: '$4',
});
