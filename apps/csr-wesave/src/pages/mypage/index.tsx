import { useState, lazy } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames/bind';
import mypageStyles from '@/styles/mypage.module.scss';
import {  removeAccessToken } from '@/utils';
import { useFetchUser } from '@/hooks/quries/user/useUser';

const myPageCx = cn.bind(mypageStyles);

const Resign = lazy(() => import('@/components/template/user/Resign'));

const user = {
  id: 1,
  name: '위세이브',
  email: 'jfmam@naver.com',
};

export default function MyPage() {
  const [isResignUIVisible, setIsResignUIVisible] = useState(false);
  const { data: user } = useFetchUser();

  if (isResignUIVisible) {
    return <Resign userId={user?.id as any} onChangeMyPageUI={() => setIsResignUIVisible(false)} />;
  }

  return (
    <div className={myPageCx('mypage')}>
      <div className={myPageCx('name')}>{user?.name}님</div>
      <div className={myPageCx('user-info')}>
        <div className={myPageCx('user-email')}>{user?.email}</div>
        <div className={myPageCx('user-name')}>이름:{user?.name}</div>
      </div>
      <div className={myPageCx('anchor-container')}>
        <Link className={myPageCx('anchor')} to="/salary">
          내 소득변경
        </Link>
        <Link onClick={() => removeAccessToken()} className={myPageCx('anchor')} to="/">
          로그아웃
        </Link>
        <button className={myPageCx('anchor')} onClick={() => setIsResignUIVisible(true)}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
