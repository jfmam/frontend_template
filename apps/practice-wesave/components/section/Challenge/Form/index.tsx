import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import 'date-fns';
import cn from 'classnames/bind';
import * as yup from 'yup';
import { PrimaryBtn } from '@/components/atom';
import styles from '@/styles/ChallengeCreateForm.module.scss';

import { InitialValuesType } from './constants';
import NameInput from './NameInput';
import ChallengeTypeSelector from './ChallengeTypeSelector';
import DateSelector from './DateSelector';
import BadgeSelector from './BadgeSelector';

const cx = cn.bind(styles);
const registerSchema = yup.object().shape({
  name: yup.string().max(20).required('챌린지 이름을 작성해 주세요.'),
  goal: yup.string().max(20).required('목표를 설정해 주세요.'),
  actionDay: yup.array().min(1, '최소 1개이상 선택하야 합니다.'),
  badge: yup.string().required('뱃지를 선택해 주세요'),
});

interface ChallengeCreateFormProps {
  isLoading: boolean;
  isError: boolean;
  callback: Function;
}

export default function ChallengeCreateForm({ isLoading, isError, callback }: ChallengeCreateFormProps) {
  const formik = useFormik<InitialValuesType>({
    initialValues: {
      name: '',
      type: 'save',
      actionDay: [],
      endDate: new Date(),
      goal: '',
      startDate: new Date(),
      badge: 'pig',
    },
    onSubmit: (challenge: InitialValuesType, { resetForm }) => {
      callback(challenge);
      resetForm();
    },

    validationSchema: registerSchema,
  });

  useEffect(() => {
    if (isError) {
      toast.error('챌린지 생성에 실패하였습니다.');
    }
  }, [isError]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className={cx('form')}>
        <NameInput handleChange={formik.handleChange} />
        <ChallengeTypeSelector
          type={formik.values.type}
          handleChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
        />
        <DateSelector actionDay={formik.values.actionDay} setFieldValue={formik.setFieldValue} />
        <BadgeSelector
          badge={formik.values.badge}
          handleChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
        />
        <div className={cx('confirm-btn-container')}>
          <PrimaryBtn
            type="submit"
            disabled={Object.keys(formik.errors).length > 0 || isLoading || !formik.dirty}
            className={cx('confirm-btn')}
          >
            {!isError ? '만들기' : '재시도'}
          </PrimaryBtn>
        </div>
      </form>
    </>
  );
}
