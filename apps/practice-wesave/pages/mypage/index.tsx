import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import cn from 'classnames/bind';
import mypageStyles from '@/styles/mypage.module.scss';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import cookies from 'next-cookies';
import withGetServerSideProps from '@/hooks/ssr/withGetServerSideProps';
import { getUser } from '@/hooks/quries/user/useUser';
import { AuthError } from '@/common';
import { removeAccessToken } from '@/utils';

const myPageCx = cn.bind(mypageStyles);

const Resign = lazy(() => import('@/components/template/user/Resign'));

export default function MyPage({ user }: any) {
  const [isResignUIVisible, setIsResignUIVisible] = useState(false);

  return (
    <>
      {isResignUIVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Resign onChangeMyPageUI={() => setIsResignUIVisible(false)} />
        </Suspense>
      ) : (
        <div className={myPageCx('mypage')}>
          <div className={myPageCx('name')}>{user.name}님</div>
          <div className={myPageCx('user-info')}>
            <div className={myPageCx('user-email')}>{user.email}</div>
            <div className={myPageCx('user-name')}>이름:{user.name}</div>
          </div>
          <div className={myPageCx('anchor-container')}>
            <Link className={myPageCx('anchor')} href="/salary">
              내 소득변경
            </Link>
            <Link
              className={myPageCx('anchor')}
              href="/"
              onClick={() => {
                removeAccessToken();
              }}
            >
              로그아웃
            </Link>
            <button className={myPageCx('anchor')} onClick={() => setIsResignUIVisible(true)}>
              회원탈퇴
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withGetServerSideProps(async (ctx: GetServerSidePropsContext) => {
  const { token } = cookies(ctx);

  if (!token) throw new AuthError();

  const user = await getUser(token);

  return {
    props: {
      user,
    },
  };
});
