import { SizableText, SizableTextProps, useMedia } from 'tamagui';
import { FontSizeTokens } from 'tamagui';

type MyTextProps = SizableTextProps & {
  type?: 'title' | 'subtitle';
  fw?: 'bold' | 'medium' | 'regular';
};

export const MyText = ({ children, type, ...props }: MyTextProps) => {
  const media = useMedia();
  let fontSize: FontSizeTokens = '$5';

  switch (type) {
    case 'title':
      fontSize = media.lg ? '$10' : media.lg ? '$10' : '$9';
      break;
    case 'subtitle':
      break;
      fontSize = media.lg ? '$7' : '$6';
  }

  return (
    <SizableText size={fontSize} {...props}>
      {children}
    </SizableText>
  );
};
