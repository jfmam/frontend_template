import { useFormik } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames/bind';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '@/styles/reset-password.module.scss';
import { PrimaryBtn, Input } from '@/components/atom';
import { FieldErrorMessage } from '@/components/section';
import { AccountLayout, NotificationLayout } from '@/components/template';
import { useResetPassword } from '@/hooks/quries/user/usePasswordManagement';
import { isInstanceOfAPIError } from '@/common';
import { toast, Toaster } from 'react-hot-toast';

const cx = cn.bind(styles);

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .matches(/.*[0-9].*/, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .required('비밀번호를 입력해주세요'),
});

export default function ResetPassword() {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isError, isLoading } = useResetPassword();
  const a = searchParams.get('token');
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: values => {
      mutate(
        { password: values.password, token: searchParams.get('token') as any },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: error => {
            if (isInstanceOfAPIError(error) && error.name === 'AuthError') {
              return;
            }
            toast.error('지금은 패스워드를 업데이트 할 수 없습니다.');
          },
        },
      );
    },
    validationSchema: passwordSchema,
  });

  if (isSuccess) {
    <NotificationLayout icon={{ src: '/complete.svg' }}>
      <NotificationLayout.Description>
        비밀번호 재설정을
        <br />
        완료했습니다!
      </NotificationLayout.Description>
      <NotificationLayout.Confirm>
        <PrimaryBtn onClick={() => router('/login')} className={cx('login-button')}>
          로그인
        </PrimaryBtn>
      </NotificationLayout.Confirm>
    </NotificationLayout>;
  }

  return (
    <div className={cx('reset-password')}>
      <div className={cx('panel')}>
        <div className={cx('welcome-text')}>
          <p>새로운 비밀번호를</p>
          <p>입력해 주세요</p>
        </div>
        <form onSubmit={formik.handleSubmit} className={cx('form')}>
          <div className={cx('input-container')}>
            <Input
              isError={formik.errors.password !== undefined}
              onFocus={() => formik.setTouched({ password: true })}
              {...formik.getFieldProps}
              onChange={formik.handleChange}
              name="password"
              type="password"
              placeholder="비밀번호"
            />
            {!formik.errors.password && !isError && (
              <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>
            )}
            {formik.errors.password && <FieldErrorMessage message={formik.errors.password} />}
          </div>
          <div className={cx('submit-button-container')}>
            <PrimaryBtn type="submit" disabled={isLoading}>
              확인
            </PrimaryBtn>
          </div>
        </form>
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
