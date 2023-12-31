import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

const cx = cn.bind(styles);

interface SnsButtonProps {
  sns: 'naver' | 'kakao' | 'google';
  onClick: () => void;
}

export default function SnsButton({ sns, onClick }: SnsButtonProps) {
  return (
    <button className={cx('sns')} onClick={onClick}>
      <img width={64} height={64} src={`/${sns}.svg`} alt={`${sns} login button`}></img>
    </button>
  );
}
