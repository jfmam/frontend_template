import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/AccountLayout.module.scss';

const cx = cn.bind(styles);

interface AccountLayoutProps {
  imageUrl: 'login' | 'signup' | 'password-reset';
  backgroundColor: string;
  children: ReactNode;
}

export default function AccountLayout({ backgroundColor, children, imageUrl }: AccountLayoutProps) {
  return (
    <div className={cx('layout')}>
      <div className={cx('input-container')}>{children}</div>
      <div className={cx('image-container')} style={{ backgroundColor }}>
        <img width="100%" height="100%" src={`/${imageUrl}.svg`} alt="" className="image" />
      </div>
    </div>
  );
}
