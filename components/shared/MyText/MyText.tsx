import { SizableText, SizableTextProps, useMedia } from 'tamagui';

type MyTextProps = SizableTextProps & {
  type?: 'title';
};

export const MyText = ({ children, type, ...props }: MyTextProps) => {
  const media = useMedia();
  let fontSize = '$5';

  if (type === 'title') {
    fontSize = media.xl ? '$10' : media.lg ? '$9' : '$9';
  }

  return (
    <SizableText size={fontSize} {...props}>
      {children}
    </SizableText>
  );
};
