// app/_layout.tsx
import { Header } from '@/components/Header/Header';
import { Slot } from 'expo-router';
import { Footer } from '@/components/Footer/Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
