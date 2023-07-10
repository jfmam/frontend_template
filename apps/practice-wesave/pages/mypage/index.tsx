import Link from 'next/link';
import cn from 'classnames/bind';
import mypageStyles from '@/styles/mypage.module.scss';
import resignStyles from '@/styles/resign.module.scss';
import { useState } from 'react';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';

const myPageCx = cn.bind(mypageStyles);
const resignCx = cn.bind(resignStyles);

const user = {
  name: '위세이브',
  email: 'jfmam@naver.com',
};

interface ResignProps {
  onChangeMyPageUI: () => void;
}

function Resign({ onChangeMyPageUI }: ResignProps) {
  return (
    <div className={resignCx('resign')}>
      <div className={resignCx('resign-message')}>
        <div>WESAVE</div>
        <div>회원탈퇴 하시겠습니까?</div>
      </div>
      <div className={resignCx('button-container')}>
        <div>
          <PrimaryBtn className={resignCx('button')} onClick={() => onChangeMyPageUI()}>
            취소
          </PrimaryBtn>
        </div>
        <div>
          <PrimaryBtn className={resignCx('button', 'button-cancel')} onClick={() => {}}>
            탈퇴
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

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
        <Resign onChangeMyPageUI={() => setIsResignUIVisible(false)} />
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
