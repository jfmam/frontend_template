import { ReactElement } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/router';
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
import cn from 'classnames/bind';

import styles from '@/styles/signin.module.scss';
import AccountLayout from '@/components/layout/AccountLayout';
import Input from '@/components/input';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';
import { SnsButton } from '@/components/button/SnsButton';

// interface SignInValues {
//   email: string;
//   password: string;
// }

// const signInSchema = Yup.object().shape({
//   email: Yup.string().email().required('이메일을 입력해주세요'),
//   password: Yup.string().required('비밀번호를 입력해주세요'),
// });

const cx = cn.bind(styles);

export default function SignIn() {
  // const router = useRouter();
  // const formik = useFormik<SignInValues>({
  //   initialValues: {
  //     email: '',
  //     password: '',
  //   },
  //   onSubmit: (values) => { },
  //   validationSchema: signInSchema
  // })

  // const login = useMutation('login', async (params: SignInValues) => loginAPI(params), {
  //   onError: err => {
  //     console.log(err);
  //     setIsAuthenticated(false);
  //   },
  //   onSuccess: data => {
  //     setLocalStorageItem('token', data.data);
  //     queryClient.invalidateQueries('login-status');
  //     setIsAuthenticated(true);
  //     router.push('/');
  //   },
  // });
  // const { data } = useQuery('login-status', () => getLocalStorageItem<Token>('token'));

  // useEffect(() => {
  //   if (data?.accessToken) {
  //     router.push('/');
  //   }
  // }, [data, router]);

  // const socialLogin = useMutation(async (params: SocialType) => await socialLoginAPI(params), {
  //   onError: err => {
  //     console.log(err);
  //   },
  //   onSuccess: data => {
  //     console.log(data);
  //     console.log('로그인 성공');
  //   },
  // });

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/');
  //   }
  // }, [isAuthenticated]);
  return (
    <div className={cx('signin')}>
      <div className={cx('panel')}>
        <h1 className={cx('title')}>로그인</h1>
        <form className={cx('form')}>
          <div className={cx('input-container')}>
            <Input name="email" type="email" placeholder="이메일" />
            {/* <ErrorMessage name="email" component="div" /> */}
          </div>
          <div className={cx('input-container')}>
            <Input name="password" type="password" placeholder="비밀번호" />
            {/* <ErrorMessage name="password" component="div" /> */}
            {/* {!isAuthenticated && finalInfo.email === values.email && finalInfo.password === values.password && (
              <div css={inputError}>
                위세이브에 가입되어 있지 않은 계정이거나, 이메일 또는 비밀번호가 일치하지 않습니다.
              </div>
            )} */}
          </div>
          <div className={cx('submit-button-container')}>
            <PrimaryBtn>로그인</PrimaryBtn>
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
