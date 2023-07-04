import type { NextPage } from 'next';
import cn from 'classnames/bind';
import styles from '@/styles/Home.module.scss';
import router from 'next/router';
import Image from 'next/image';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';

const cx = cn.bind(styles);

const Home: NextPage = () => {
  return (
    <div className={cx('home')}>
      <div className={cx('image-container')}>
        <Image src="/main.svg" width="840" height="420" alt="welcome wesaver" loading="lazy" />
      </div>
      <div className={cx('button-container')}>
        <PrimaryBtn onClick={() => router.push('/salary')}>{"Let's WESAVE"}</PrimaryBtn>
      </div>
    </div>
  );
};

export default Home;
