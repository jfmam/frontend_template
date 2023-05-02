import '@/styles/globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import Header from '@/components/header';
import { ModalContext } from '@/components/Modal/NavigationModalContext';
import MenuModal from '@/components/Modal/NavigationModal';
import { pretendard } from '@/config/fonts';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <div className={pretendard.className}>
      <ModalContext>
        <MenuModal />
        <Header />
      </ModalContext>
      <main id="main">{getLayout(<Component {...pageProps} />)}</main>
    </div>
  );
}
