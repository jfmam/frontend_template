import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

const cx = cn.bind(styles);

interface SnsButtonProps {
  sns: 'naver' | 'kakao' | 'google';
  onClick: () => void;
}

export const SnsButton = ({ sns, onClick }: SnsButtonProps) => {
  return (
    <button className={cx('sns')} onClick={onClick}>
      <Image width={64} height={64} src={`/${sns}.svg`} alt={`${sns} login button`}></Image>
    </button>
  );
};
