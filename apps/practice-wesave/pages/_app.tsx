import 'reflect-metadata';
import '@/styles/globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Header } from '@/components/section';
import { pretendard } from '@/config/fonts';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppOwnProps = { redirectUrl?: string };
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
} & AppOwnProps;

export default function App(a: AppPropsWithLayout) {
  const { Component, pageProps } = a;
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
    <>
      <div className={pretendard.className}>
        <Header />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <main id="main">{getLayout(<Component {...pageProps} />)}</main>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </div>
    </>
  );
}
