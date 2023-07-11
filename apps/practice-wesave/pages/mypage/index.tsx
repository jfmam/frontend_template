import Link from 'next/link';
import cn from 'classnames/bind';
import mypageStyles from '@/styles/mypage.module.scss';
import { useState, lazy, Suspense } from 'react';

const myPageCx = cn.bind(mypageStyles);

const Resign = lazy(() => import('@/components/user/Resign'));

const user = {
  id: 1,
  name: '위세이브',
  email: 'jfmam@naver.com',
};

// 추후 로그인 검사 기능을 만들고 조금 더 수정이 필요함
export default function MyPage() {
  const [isResignUIVisible, setIsResignUIVisible] = useState(false);
  //   const { width } = useLayout();
  //   const { data } = useUser();

  //   useEffect(() => {
  //     if (!isLoggedIn()) {
  //       router.push('/signin');
  //     }
  //   }, []);

  return (
    <>
      {isResignUIVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Resign userId={user.id} onChangeMyPageUI={() => setIsResignUIVisible(false)} />
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
            <Link className={myPageCx('anchor')} href="/">
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
