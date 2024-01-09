import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import cn from 'classnames';

import { NaverLogin } from '@/hooks/quries/user/useLogin';
import styles from '@/styles/Callback.module.scss';

const cx = cn.bind(styles);

export default function NaverCallback() {
  const [searchParams] = useSearchParams();
  const once = useRef(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (once.current) {
      const code = searchParams.get('code');
      if (code) {
        once.current = false;
        Promise.resolve(NaverLogin(code))
          .then(() => {
            navigate('/');
          })
          .catch(() => {
            alert('로그인에 실패하였습니다.');
            navigate('/account/login');
          });
      }
    }
  }, []);

  return (
    <div className={cx('login-callback')}>
      로그인 중입니다.
      <br />
      잠시만 기다려 주세요.
    </div>
  );
}
