import cn from 'classnames/bind';
import styles from '@/styles/FieldErrorMessage.module.scss';

const cx = cn.bind(styles);

interface FieldErrorMessageProps {
  message: string;
}
export default function FieldErrorMessage({ message }: FieldErrorMessageProps) {
  return <div className={cx('message')}>{message}</div>;
}
