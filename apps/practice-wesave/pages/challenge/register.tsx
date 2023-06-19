import { ReactElement, useState } from 'react';
import cn from 'classnames/bind';
import * as yup from 'yup';
import { useMediaQuery } from 'react-responsive';

import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import ChallengeCreateForm, { InitialValuesType } from '@/components/Challenge/Form';
import styles from '@/styles/Register.module.scss';
import { useRegistChallenges } from '@/hooks/quries/challenge/useRegistChallenges';
import { useFormik } from 'formik';
import ChallengeGuideLayout from '@/components/layout/challenge/ChallengeGuideLayout';

const cx = cn.bind(styles);

const registerSchema = yup.object().shape({
  name: yup.string().max(20).required('챌린지 이름을 작성해 주세요.'),
  goal: yup.string().max(20).required('목표를 설정해 주세요.'),
  actionDay: yup.array().min(1, '최소 1개이상 선택하야 합니다.'),
  badge: yup.string().required('뱃지를 선택해 주세요'),
});

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isLoading } = useRegistChallenges();
  const isDesktop = useMediaQuery({
    query: '(min-width: 425px)',
  });
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
  return (
    <div className={cx('register')}>
      {isSuccess ? (
        <ChallengeGuideLayout
          icon={{ src: '/complete.svg', width: isDesktop ? 95 : 70, height: isDesktop ? 95 : 70 }}
          description={{ first: '새로운 챌린지를', second: '만들었습니다!' }}
          onClickButton={() => setIsSuccess(false)}
        />
      ) : (
        <ChallengeCreateForm isLoading={isLoading} formik={formik} />
      )}
    </div>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
