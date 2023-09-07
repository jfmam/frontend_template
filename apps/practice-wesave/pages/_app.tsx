import 'reflect-metadata';
import '@/styles/globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode, useState, lazy } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { Header } from '@/components/section';
import { ModalContext as NavigationModalContext } from '@/components/section/Modal/navigation/NavigationModalContext';
import { pretendard } from '@/config/fonts';

const NavigationModal = lazy(() => import('@/components/section/Modal/navigation/NavigationModal'));

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            suspense: true,
          },
        },
      }),
  );
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <div className={pretendard.className}>
          <NavigationModalContext>
            <NavigationModal />
            <Header />
          </NavigationModalContext>
          <main id="main">{getLayout(<Component {...pageProps} />)}</main>
        </div>
      </Hydrate>
    </QueryClientProvider>
  );
}
