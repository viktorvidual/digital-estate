import { SizableText, SizableTextProps } from 'tamagui';

export const MyText = ({ children, ...props }: SizableTextProps) => {
  return (
    <SizableText size="$5" {...props}>
      {children}
    </SizableText>
  );
};
