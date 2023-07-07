import { ReactElement } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import cn from 'classnames/bind';
import AccountLayout from '@/components/layout/AccountLayout';
import FieldErrorMessage from '@/components/error/FieldErrorMessage';
import Input from '@/components/input';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';
import styles from '@/styles/signup.module.scss';
import { SnsButton } from '@/components/button/SnsButton';

const cx = cn.bind(styles);

type SignUpType = {
  name: string;
  email: string;
  password: string;
  passwordCheck: string;
  agree: boolean;
};

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
  const formik = useFormik<SignUpType>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
      agree: false,
    },
    onSubmit: () => {},
    validationSchema: signUpSchema,
  });
  console.log(formik.errors.password);
  return (
    <div className={cx('signup')}>
      <div className={cx('panel')}>
        <h1 className={cx('title')}>회원가입</h1>
        <form onSubmit={formik.handleSubmit} className={cx('form')}>
          <div className={cx('input-container')}>
            <Input
              isError={formik.errors.name !== undefined}
              name="name"
              placeholder="이름"
              onChange={formik.handleChange}
            />
            {formik.errors.name && <FieldErrorMessage message={formik.errors.name} />}
          </div>
          <div className={cx('input-container')}>
            <Input
              isError={formik.errors.email !== undefined}
              name="email"
              type="email"
              placeholder="이메일"
              onChange={formik.handleChange}
            />
            {formik.errors.email && <FieldErrorMessage message={formik.errors.email} />}
            {/* {existUser && <div css={inputError}>위세이브에 이미 가입된 계정입니다.</div>} */}
          </div>
          <div className={cx('input-container')}>
            <Input
              isError={formik.errors.password !== undefined}
              onChange={formik.handleChange}
              name="password"
              type="password"
              placeholder="비밀번호"
            />
            {!formik.errors.password && <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>}
            {formik.errors.password && <FieldErrorMessage message={formik.errors.password} />}
          </div>
          <div className={cx('input-container')}>
            <Input
              isError={formik.errors.passwordCheck !== undefined}
              onChange={formik.handleChange}
              name="passwordCheck"
              type="password"
              placeholder="비밀번호 확인"
            />
            {formik.errors.passwordCheck && <FieldErrorMessage message={formik.errors.passwordCheck} />}
          </div>
          <div className={cx('submit-button-container')}>
            <PrimaryBtn type="submit">회원가입</PrimaryBtn>
          </div>
        </form>
        <div className={cx('auth-button-container')}>
          <Link className={cx('anchor')} href="/login">
            로그인
          </Link>
        </div>
        <div className={cx('sns-button-container')}>
          <SnsButton sns="naver" onClick={() => {}} />
          <SnsButton sns="kakao" onClick={() => {}} />
          <SnsButton sns="google" onClick={() => {}} />
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
