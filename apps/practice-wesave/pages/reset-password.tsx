import { useFormik } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames/bind';
import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/reset-password.module.scss';
import { PrimaryBtn, Input } from '@/components/atom';
import { FieldErrorMessage } from '@/components/section';
import { AccountLayout, NotificationLayout } from '@/components/template';
import { useResetPassword } from '@/hooks/quries/user/usePasswordManagement';
import { getUser } from '@/hooks/quries/user/useUser';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import withGetServerSideProps from '@/hooks/ssr/withGetServerSideProps';
import { AuthError, isInstanceOfAPIError } from '@/common';
import { toast, Toaster } from 'react-hot-toast';

const cx = cn.bind(styles);

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .matches(/.*[0-9].*/, '비밀번호는 숫자 포함된 8자 이상만 가능합니다.')
    .required('비밀번호를 입력해주세요'),
});

export default function ResetPassword() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isError, isLoading } = useResetPassword();

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: values => {
      mutate(
        { password: values.password, token: router.query?.token },
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
        <PrimaryBtn onClick={() => router.push('/login')} className={cx('login-button')}>
          로그인
        </PrimaryBtn>
      </NotificationLayout.Confirm>
    </NotificationLayout>;
  }

  return (
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
            name="password"
            type="password"
            placeholder="비밀번호"
          />
          {!formik.errors.password && !isError && <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>}
          {formik.errors.password && <FieldErrorMessage message={formik.errors.password} />}
        </div>
        <div className={cx('submit-button-container')}>
          <PrimaryBtn type="submit" disabled={isLoading}>
            확인
          </PrimaryBtn>
        </div>
      </form>
      <Toaster position="top-center" />
    </>
  );
}

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout backgroundColor="#a8a1f8" imageUrl="password-reset">
      <div className={cx('reset-password')}>
        <div className={cx('panel')}>{page}</div>
      </div>
    </AccountLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withGetServerSideProps(async (ctx: GetServerSidePropsContext) => {
  const token = ctx.query?.token;

  if (!token || Array.isArray(token)) throw new AuthError();
  const user = await getUser(token);

  if (!user) throw new AuthError();

  return {
    props: {},
  };
});
