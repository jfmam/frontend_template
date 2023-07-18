import type { NextPage } from 'next';
import cn from 'classnames/bind';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';
import { useEffect, useState } from 'react';
import LocalStorage from '@/utils/storage';

const cx = cn.bind(styles);

const Home: NextPage = () => {
  const [route, setRoute] = useState<'salary' | 'timer'>('salary');

  useEffect(() => {
    const value = LocalStorage.getItem('income');

    if (!!value) setRoute('timer');
  }, []);

  return (
    <div className={cx('home')}>
      <div className={cx('image-container')}>
        <Image src="/main.svg" width="840" height="420" alt="welcome wesaver" loading="lazy" />
      </div>
      <div className={cx('button-container')}>
        <Link href={`/${route}`}>
          <PrimaryBtn>{"Let's WESAVE"}</PrimaryBtn>
        </Link>
      </div>
    </div>
  );
};

export default Home;
