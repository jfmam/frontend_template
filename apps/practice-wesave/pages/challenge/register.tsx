import { ReactElement, useCallback, useEffect, useState } from 'react';
import cn from 'classnames/bind';
import { toast, Toaster } from 'react-hot-toast';
import ChallengeCreateForm from '@/components/section/Challenge/Form';

import { ChallengeLayout, NotificationLayout } from '@/components/template';
import { useRegistChallenges } from '@/hooks/quries/challenge/useRegistChallenges';
import styles from '@/styles/Register.module.scss';
import { PrimaryBtn } from '@/components/atom';
import { Challenge } from '@/common';

const cx = cn.bind(styles);

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isLoading, isError } = useRegistChallenges();
  const onSubmit = useCallback(
    (challenge: Challenge) => {
      mutate(challenge, {
        onSuccess: () => {
          setIsSuccess(true);
        },
      });
    },
    [mutate],
  );

  useEffect(() => {
    if (isError) {
      toast.error('챌린지 생성에 실패하였습니다.');
    }
  }, [isError]);

  if (isSuccess) {
    return (
      <NotificationLayout icon={{ src: '/complete.svg' }}>
        <NotificationLayout.Description>
          새로운 챌린지를
          <br />
          만들었습니다!
        </NotificationLayout.Description>
        <NotificationLayout.Confirm>
          <PrimaryBtn onClick={() => setIsSuccess(false)} className={cx('confirm-button')}>
            챌린지 만들기
          </PrimaryBtn>
        </NotificationLayout.Confirm>
      </NotificationLayout>
    );
  }

  return (
    <>
      <ChallengeCreateForm callback={onSubmit} isError={isError} isLoading={isLoading} />
      {isError && <Toaster position="top-center" />}
    </>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <ChallengeLayout>
      <div className={cx('register')}>{page}</div>
    </ChallengeLayout>
  );
};
