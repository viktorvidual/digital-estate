export * from './globalStyles';
export * from './headerRoutes';
export * from './Endpoints';
export * from './ImageSettings';
export * from './TermsOfService';
export * from './PrivacyPolicy';
export * from './PasswordRequirements';
export * from './Pricing';

export const IsProduction = process.env.EXPO_PUBLIC_IS_PROD === 'true';
