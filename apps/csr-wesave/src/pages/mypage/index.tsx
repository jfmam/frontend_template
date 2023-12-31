import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames/bind';
import mypageStyles from '@/styles/mypage.module.scss';

const myPageCx = cn.bind(mypageStyles);

const Resign = lazy(() => import('@/components/template/user/Resign'));

const user = {
  id: 1,
  name: '위세이브',
  email: 'jfmam@naver.com',
};


export default function MyPage(props: any) {
  const [isResignUIVisible, setIsResignUIVisible] = useState(false);

  return (
    <>
      {isResignUIVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Resign userId={user.id} onChangeMyPageUI={() => setIsResignUIVisible(false)} />
        </Suspense>
      ) : (
        <div className={myPageCx('mypage')}>
          <div className={myPageCx('name')}>{props.data.name}님</div>
          <div className={myPageCx('user-info')}>
            <div className={myPageCx('user-email')}>{user.email}</div>
            <div className={myPageCx('user-name')}>이름:{user.name}</div>
          </div>
          <div className={myPageCx('anchor-container')}>
            <Link className={myPageCx('anchor')} to="/salary">
              내 소득변경
            </Link>
            <Link className={myPageCx('anchor')} to="/">
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
