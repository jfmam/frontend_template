import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import cn from 'classnames/bind';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home.module.scss';
import { PrimaryBtn } from '@/components/atom';
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
        <Image src="/main.svg" fill alt="welcome wesaver" loading="eager" />
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
