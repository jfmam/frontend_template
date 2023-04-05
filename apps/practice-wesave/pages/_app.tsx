import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '@/components/header';
import { ModalContext } from '@/components/Modal/ModalContext';
import MenuModal from '@/components/Modal';
import { pretendard } from '@/config/fonts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={pretendard.className}>
      <ModalContext>
        <MenuModal />
        <Header />
      </ModalContext>
      <main id="main">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
