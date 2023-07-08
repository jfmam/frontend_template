import { useFormik } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames/bind';
import { ReactElement } from 'react';
import styles from '@/styles/reset-password.module.scss';
import Input from '@/components/input';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';
import FieldErrorMessage from '@/components/error/FieldErrorMessage';
import AccountLayout from '@/components/layout/Account/AccountLayout';

const cx = cn.bind(styles);

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .matches(/.*[0-9].*/, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .required('비밀번호를 입력해주세요'),
});

export default function ResetPassword() {
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: () => {},
    validationSchema: passwordSchema,
  });

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
            {!formik.errors.password && <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>}
            {formik.errors.password && <FieldErrorMessage message={formik.errors.password} />}
          </div>
          <div className={cx('submit-button-container')}>
            <PrimaryBtn type="submit">확인</PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout backgroundColor="#a8a1f8" imageUrl="password-reset">
      {page}
    </AccountLayout>
  );
};
