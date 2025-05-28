import { useToastController } from '@tamagui/toast';

type ToastType = 'success' | 'error' | 'info';

export type ShowToast = (params: {
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}) => void;

export const useShowToast = () => {
  const toast = useToastController();

  return (params: { title: string; description?: string; type: ToastType; duration?: number }) => {
    toast.show(params.title, {
      ...(params.description && { message: params.description }),
      duration: params.duration || 4000,
      extra: { type: params.type },
    });
  };
};
