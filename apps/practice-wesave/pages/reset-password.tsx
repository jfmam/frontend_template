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
            onClick={() => setIsSettled(false)}
            name="password"
            type="password"
            placeholder="비밀번호"
          />
          {!formik.errors.password && !isError && <span className={cx('password-condition')}>8자 이상, 숫자 포함</span>}
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
