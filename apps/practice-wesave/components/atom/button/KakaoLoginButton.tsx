import { useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from '@/styles/button.module.scss';

const cx = cn.bind(styles);

export default function SnsButton() {
  const kakao = useRef<any>();
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js';
    script.integrity = 'sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
    script.onload = () => {
      kakao.current = (window as any).Kakao;
      if (kakao.current) {
        kakao.current.init(process.env.REACT_APP_KAKAO_KEY);
      }
    };
  }, []);


  return (
    <button className={cx('sns')} onClick={onClick}>
      <img width={64} height={64} src={`/kakao.svg`} alt={`kakao login button`}></img>
    </button>
  );
}
