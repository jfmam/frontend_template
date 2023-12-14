import Image from 'next/image';
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
        <Image src={`${imageUrl}.svg`} fill alt="" className="image" />
      </div>
    </div>
  );
}
