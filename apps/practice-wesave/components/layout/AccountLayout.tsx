import Image from 'next/image';
import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/AccountLayout.module.scss';

const cx = cn.bind(styles);

interface AccountLayoutProps {
  imageUrl: 'login' | 'signup';
  backgroundColor: string;
  children: ReactNode;
}

export default function AccountLayout({ backgroundColor, children, imageUrl }: AccountLayoutProps) {
  return (
    <div className={cx('layout')}>
      {children}
      <div className={cx('divide-line')}></div>
      <div className={cx('image-container')} style={{ backgroundColor }}>
        <Image src={`${imageUrl}.svg`} fill alt="" className="image" loading="lazy" />
      </div>
    </div>
  );
}
