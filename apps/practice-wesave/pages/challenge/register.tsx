import { ReactElement, useState } from 'react';
import cn from 'classnames/bind';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { ChallengeLayout, NotificationLayout } from '@/components/template';
import { ChallengeCreateForm, InitialValuesType } from '@/components/section';
import { useRegistChallenges } from '@/hooks/quries/challenge/useRegistChallenges';
import styles from '@/styles/Register.module.scss';
import { PrimaryBtn } from '@/components/atom';

const cx = cn.bind(styles);

const registerSchema = yup.object().shape({
  name: yup.string().max(20).required('챌린지 이름을 작성해 주세요.'),
  goal: yup.string().max(20).required('목표를 설정해 주세요.'),
  actionDay: yup.array().min(1, '최소 1개이상 선택하야 합니다.'),
  badge: yup.string().required('뱃지를 선택해 주세요'),
});

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isLoading, isError } = useRegistChallenges();
  const formik = useFormik<InitialValuesType>({
    initialValues: {
      name: '',
      type: 'save',
      actionDay: [],
      endDate: '',
      goal: '',
      startDate: '',
      badge: 'pig',
    },
    onSubmit: (challenge: InitialValuesType, { resetForm }) => {
      mutate(challenge, {
        onSuccess: () => {
          resetForm();
          setIsSuccess(true);
        },
      });
    },
    validationSchema: registerSchema,
  });

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

  return <ChallengeCreateForm isError={isError} isLoading={isLoading} formik={formik} />;
}

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <ChallengeLayout>
      <div className={cx('register')}>{page}</div>
    </ChallengeLayout>
  );
};
