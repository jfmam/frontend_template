import { useNavigate } from 'react-router-dom';
import cn from 'classnames/bind';
import styles from '@/styles/error.module.scss';
import { PrimaryBtn } from '../../atom';

const cx = cn.bind(styles);

export default function NetworkError() {
  const router = useNavigate();

  return (
    <div className={cx('container')}>
      <div className={cx('message')}>네트워크 상태가 불안정합니다.</div>
      <PrimaryBtn onClick={() => router(0)}>재시도</PrimaryBtn>
    </div>
  );
}
