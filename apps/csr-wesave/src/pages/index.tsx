import { useEffect, useState } from 'react';
import cn from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from '@/styles/Home.module.scss';
import { PrimaryBtn } from '@/components/atom';
import LocalStorage from '@/utils/storage';

const cx = cn.bind(styles);

const Home = () => {
  const [route, setRoute] = useState<'salary' | 'timer'>('salary');

  useEffect(() => {
    const value = LocalStorage.getItem('income');

    if (!!value) setRoute('timer');
  }, []);

  return (
    <div className={cx('home')}>
      <div className={cx('image-container')}>
        <img src="/main.svg" width="100%" height="100%" alt="welcome wesaver" loading="eager" />
      </div>
      <div className={cx('button-container')}>
        <Link to={`/${route}`}>
          <PrimaryBtn>{"Let's WESAVE"}</PrimaryBtn>
        </Link>
      </div>
    </div>
  );
};

export default Home;
