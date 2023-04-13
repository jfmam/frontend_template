import React from 'react';
import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/challenge.module.scss';

import { PrimaryBtn } from '../button';

const cx = cn.bind(styles);

export default function ChallengeRegister() {
  return (
    <div>
      <div>
        <Image width={95} height={95} alt="" src="empty.svg" />
      </div>
      <div>
        <p className={cx('description')}>
          오늘은 챌린지가 없습니다
          <br />
          챌린지를 추가해 보세요!
        </p>
      </div>
      <div className={cx('confirm-container')}>
        <PrimaryBtn className={cx('confirm')}>챌린지 만들기</PrimaryBtn>
      </div>
    </div>
  );
}
