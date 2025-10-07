import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

const customColors = {
  blue13: '#0a1929', // your very dark blue
};

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },

  media: {
    ...defaultConfig.media,
    lg: { minWidth: 1024 },

    xl: { minWidth: 1280 },
    '2xl': { minWidth: 2000 },
  },

  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      ...customColors,
    },
    dark: {
      ...defaultConfig.themes.dark,
      ...customColors,
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
