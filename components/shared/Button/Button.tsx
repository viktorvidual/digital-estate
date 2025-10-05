import { Button as TamaguiButton, ButtonProps as TanaguiButtonProps } from 'tamagui';

type ButtonProps = {
  children: React.ReactNode;
} & TanaguiButtonProps;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <TamaguiButton hoverStyle={{}} bg="$blue10" p="$5" {...props}>
      {children}
    </TamaguiButton>
  );
};
