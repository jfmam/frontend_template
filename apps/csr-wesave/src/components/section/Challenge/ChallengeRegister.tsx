import React from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/challenge.module.scss';

import { PrimaryBtn } from '../../atom';
import { NotificationLayout } from '@/components/template';
import { Link } from 'react-router-dom';

const cx = cn.bind(styles);

export default function ChallengeRegister() {
  return (
    <NotificationLayout icon={{ src: '/empty.svg' }}>
      <NotificationLayout.Description>
        오늘은 챌린지가 없습니다
        <br />
        챌린지를 추가해 보세요!
      </NotificationLayout.Description>
      <NotificationLayout.Confirm>
        <Link to={'/challenge/register'}>
          <PrimaryBtn className={cx('register-button')}>챌린지 만들기</PrimaryBtn>
        </Link>
      </NotificationLayout.Confirm>
    </NotificationLayout>
  );
}
