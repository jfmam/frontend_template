import { ReactElement } from 'react';
import cn from 'classnames/bind';

import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import ChallengeCreateForm from '@/components/Challenge/Form';
import styles from '@/styles/Register.module.scss';

const cx = cn.bind(styles);

export default function Register() {
  return (
    <div className={cx('register')}>
      <ChallengeCreateForm />
    </div>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
