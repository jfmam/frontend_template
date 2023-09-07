import { ReactElement, useState } from 'react';
import cn from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '@/styles/forgot-password.module.scss';
import { AccountLayout } from '@/components/template';
import { PrimaryBtn, Input } from '@/components/atom';
import Link from 'next/link';
import { FieldErrorMessage } from '@/components/section';
import { useFindUser } from '@/hooks/quries/user/usePasswordManagement';

const cx = cn.bind(styles);

const EmailSchema = Yup.object().shape({
  email: Yup.string().email('올바른 이메일을 입력해주세요.').required('이메일을 입력해주세요'),
});

export default function ForgotPassword() {
  const { mutate, isError, isLoading } = useFindUser();
  const [isSettled, setIsSettled] = useState(false);
  const formik = useFormik<{ email: string }>({
    initialValues: {
      email: '',
    },
    validationSchema: EmailSchema,
    onSubmit: values => {
      mutate(values.email, {
        onSettled: () => {
          setIsSettled(true);
        },
      });
    },
  });

  return (
    <div className={cx('forgot-password')}>
      <div className={cx('panel')}>
        <div className={cx('welcome-text')}>
          <p>회원가입 시 등록했던</p>
          <p>이메일을 입력해주세요</p>
        </div>
        <form onSubmit={formik.handleSubmit} className={cx('form')}>
          <div className={cx('input-container')}>
            <Input
              {...formik.getFieldProps}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              onClick={() => setIsSettled(false)}
              isError={formik.errors.email !== undefined}
              onFocus={() => formik.setTouched({ email: true })}
              name="email"
              type="email"
              placeholder="이메일"
            />
            {formik.errors.email && formik.touched.email && <FieldErrorMessage message={formik.errors.email} />}
            {!formik.errors.email && isSettled && isError && (
              <FieldErrorMessage message="위세이브에 가입되어 있지 않은 계정이거나, 이메일이 일치하지 않습니다." />
            )}
            {!isError && isSettled && (
              <div className={cx('resend-container')}>
                <span>인증 이메일을 받지 못하셨나요?</span>
                <span>
                  <button disabled={isLoading} type="submit" className={cx('resend-button')}>
                    인증메일 재전송
                  </button>
                </span>
              </div>
            )}
          </div>
          <div className={cx('submit-button-container')}>
            <PrimaryBtn disabled={isLoading} type="submit">
              인증 메일 전송
            </PrimaryBtn>
          </div>
          <div className={cx('auth-button-container')}>
            <Link className={cx('anchor')} href="/signin">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

ForgotPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout backgroundColor="#a8a1f8" imageUrl="password-reset">
      {page}
    </AccountLayout>
  );
};
