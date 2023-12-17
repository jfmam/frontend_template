import { ReactElement } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import cn from 'classnames/bind';
import { useRouter } from 'next/router';
import { AccountLayout, NotificationLayout } from '@/components/template';
import { FieldErrorMessage } from '@/components/section';
import { PrimaryBtn, Input } from '@/components/atom';
import styles from '@/styles/signup.module.scss';
import { useSignUp } from '@/hooks/quries/user/useSignUp';
import { SignUpType } from '@/common';

const cx = cn.bind(styles);

Yup.setLocale({
  string: {
    email: '정확한 이메일 양식을 입력해주세요',
  },
});

const signUpSchema = Yup.object().shape({
  name: Yup.string().required('이름을 입력해주세요'),
  email: Yup.string().email('올바른 이메일을 입력해주세요.').required('이메일을 입력해주세요'),
  password: Yup.string()
    .min(8, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .matches(/.*[0-9].*/, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .required('비밀번호를 입력해주세요'),
  passwordCheck: Yup.string()
    .required('비밀번호를 확인해주세요')
    .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다'),
});

export default function SignUp() {
  const { mutate, isError, isLoading, isSuccess } = useSignUp();
  const router = useRouter();
  const formik = useFormik<SignUpType>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
      agree: false,
    },
    onSubmit: (values, { resetForm }) => {
      mutate(values, {
        onSuccess: () => {
          resetForm();
        },
      });
    },
    validationSchema: signUpSchema,
  });

  const setTouchField = (key: keyof SignUpType) => {
    formik.setTouched({ [key]: true });
  };

  if (isSuccess) {
    return (
      <NotificationLayout icon={{ src: '/complete.svg' }}>
        <NotificationLayout.Description>
          환영해요!
          <br />
          회원가입을 완료했습니다!
        </NotificationLayout.Description>
        <NotificationLayout.Confirm>
          <PrimaryBtn onClick={() => router.push('/login')} className={cx('login-button')}>
            로그인
          </PrimaryBtn>
        </NotificationLayout.Confirm>
      </NotificationLayout>
    );
  }

  return (
    <div className={cx('signup')}>
      <div className={cx('panel')}>
        <div>
          <h1 className={cx('title')}>회원가입</h1>
          <form onSubmit={formik.handleSubmit} className={cx('form')}>
            <div className={cx('input-container')}>
              <Input
                isError={formik.errors.name !== undefined}
                {...formik.getFieldProps('name')}
                onFocus={() => {
                  setTouchField('name');
                }}
                name="name"
                placeholder="이름"
              />
              {formik.errors.name && formik.touched.name && <FieldErrorMessage message={formik.errors.name} />}
            </div>
            <div className={cx('input-container')}>
              <Input
                isError={formik.errors.email !== undefined}
                {...formik.getFieldProps('email')}
                onFocus={() => {
                  setTouchField('email');
                }}
                name="email"
                type="email"
                placeholder="이메일"
              />
              {formik.errors.email && formik.touched.email && <FieldErrorMessage message={formik.errors.email} />}
              {!formik.errors.email && isError && <FieldErrorMessage message="위세이브에 이미 가입된 계정입니다" />}
            </div>
            <div className={cx('input-container')}>
              <Input
                isError={formik.errors.password !== undefined}
                {...formik.getFieldProps('password')}
                onFocus={() => {
                  setTouchField('password');
                }}
                name="password"
                type="password"
                placeholder="비밀번호"
              />
              {!formik.errors.password && <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>}
              {formik.errors.password && formik.touched.password && (
                <FieldErrorMessage message={formik.errors.password} />
              )}
            </div>
            <div className={cx('input-container')}>
              <Input
                isError={formik.errors.passwordCheck !== undefined}
                {...formik.getFieldProps('passwordCheck')}
                onFocus={() => {
                  setTouchField('passwordCheck');
                }}
                name="passwordCheck"
                type="password"
                placeholder="비밀번호 확인"
              />
              {formik.touched.passwordCheck && formik.errors.passwordCheck && (
                <FieldErrorMessage message={formik.errors.passwordCheck} />
              )}
            </div>
            <div className={cx('submit-button-container')}>
              <PrimaryBtn disabled={isLoading} type="submit">
                회원가입
              </PrimaryBtn>
            </div>
          </form>
          <div className={cx('auth-button-container')}>
            <Link className={cx('anchor')} href="/login">
              로그인
            </Link>
          </div>
          {/* <div className={cx('sns-button-container')}>
            <SnsButton sns="naver" onClick={() => {}} />
            <SnsButton sns="kakao" onClick={() => {}} />
            <SnsButton sns="google" onClick={() => {}} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout backgroundColor="#3281F7" imageUrl="signup">
      {page}
    </AccountLayout>
  );
};
