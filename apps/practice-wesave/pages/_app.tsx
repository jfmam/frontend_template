import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Header from '@/components/header';
import { ModalContext } from '@/components/Modal/ModalContext';
import MenuModal from '@/components/Modal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalContext>
      <Header />
      <main id="main">
        <Component {...pageProps} />
      </main>
      <MenuModal />
    </ModalContext>
  );
}
