import { ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import cn from 'classnames/bind';
import styles from '@/styles/login.module.scss';
import { AccountLayout } from '@/components/template';
import { PrimaryBtn, SnsButton, Input } from '@/components/atom';
import { Token, UserLoginType } from '@/common/user';
import { useLogin } from '@/hooks/quries/user/useLogin';
import { FieldErrorMessage } from '@/components/section';
import { setAccessToken } from '@/utils';

const signInSchema = Yup.object().shape({
  email: Yup.string().email('올바른 이메일을 입력해주세요.').required('이메일을 입력해주세요.'),
  password: Yup.string().required('비밀번호를 입력해주세요.'),
});

const cx = cn.bind(styles);

export default function SignIn() {
  const { mutate, isError, isLoading } = useLogin();
  const router = useRouter();
  const formik = useFormik<UserLoginType>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values, { resetForm }) => {
      mutate(values, {
        onSuccess: ({ token }: Token) => {
          setAccessToken(token);
          router.push('/');
          resetForm();
        },
      });
    },
    validationSchema: signInSchema,
  });

  return (
    <div className={cx('signin')}>
      <div className={cx('panel')}>
        <h1 className={cx('title')}>로그인</h1>
        <form onSubmit={formik.handleSubmit} className={cx('form')}>
          <div className={cx('input-container')}>
            <Input onChange={formik.handleChange} name="email" type="email" placeholder="이메일" />
            {formik.errors.email && <FieldErrorMessage message={formik.errors.email} />}
          </div>
          <div className={cx('input-container')}>
            <Input onChange={formik.handleChange} name="password" type="password" placeholder="비밀번호" />
            {formik.errors.password && formik.touched.password && (
              <FieldErrorMessage message={formik.errors.password} />
            )}
          </div>
          {isError && (
            <FieldErrorMessage message="위세이브에 가입되어 있지 않은 계정이거나, 이메일 또는 비밀번호가 일치하지 않습니다." />
          )}
          <div className={cx('submit-button-container')}>
            <PrimaryBtn disabled={isLoading} type="submit">
              로그인
            </PrimaryBtn>
          </div>
          <div className={cx('auth-button-container')} style={{ marginBottom: '4.8rem' }}>
            <Link className={cx('anchor')} href="/forgot-password">
              비밀번호 찾기
            </Link>
            <span className={cx('button-divider')}>|</span>
            <Link className={cx('anchor')} href="/signup">
              회원가입
            </Link>
          </div>
          <div className={cx('sns-button-container')}>
            <SnsButton sns="naver" onClick={() => {}} />
            <SnsButton sns="kakao" onClick={() => {}} />
            <SnsButton sns="google" onClick={() => {}} />
          </div>
        </form>
      </div>
    </div>
  );
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout backgroundColor="#080808" imageUrl="login">
      {page}
    </AccountLayout>
  );
};
