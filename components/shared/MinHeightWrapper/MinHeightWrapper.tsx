import React from 'react';
import { getTokens } from 'tamagui';

export const MinHeightWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        minHeight: '80dvh',
      }}
    >
      {children}
    </div>
  );
};
