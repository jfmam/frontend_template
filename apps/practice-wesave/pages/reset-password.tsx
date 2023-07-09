import { useFormik } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames/bind';
import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import styles from '@/styles/reset-password.module.scss';
import Input from '@/components/input';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';
import FieldErrorMessage from '@/components/error/FieldErrorMessage';
import AccountLayout from '@/components/layout/Account/AccountLayout';
import { useResetPassword } from '@/hooks/quries/user/usePasswordManagement';
import AccountGuideLayout from '@/components/layout/Account/AccountGuideLayout';

const cx = cn.bind(styles);

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .matches(/.*[0-9].*/, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .required('비밀번호를 입력해주세요'),
});

export default function ResetPassword() {
  const { mutate, isSuccess, isError } = useResetPassword();
  const router = useRouter();
  const [isSettled, setIsSettled] = useState(false);
  const isDesktop = useMediaQuery({
    query: '(min-width: 425px)',
  });
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: values => {
      mutate(values.password, {
        onSettled: () => setIsSettled(true),
      });
    },
    validationSchema: passwordSchema,
  });

  return (
    <div className={cx('reset-password')}>
      <div className={cx('panel')}>
        {isSuccess ? (
          <AccountGuideLayout
            icon={{ src: '/complete.svg', width: isDesktop ? 95 : 70, height: isDesktop ? 95 : 70 }}
            description={{ first: '환영해요!', second: '회원가입을 완료했습니다.' }}
            onClickButton={() => router.push('/login')}
          />
        ) : (
          <>
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
                  onClick={() => setIsSettled(false)}
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                />
                {!formik.errors.password && !isError && (
                  <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>
                )}
                {formik.errors.password && <FieldErrorMessage message={formik.errors.password} />}
                {!formik.errors.password && isSettled && isError && (
                  <FieldErrorMessage message="이전과 다른 비밀번호로 설정해주세요." />
                )}
              </div>
              <div className={cx('submit-button-container')}>
                <PrimaryBtn type="submit">확인</PrimaryBtn>
              </div>
            </form>
          </>
        )}
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
