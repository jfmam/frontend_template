import cn from 'classnames/bind';
import styles from '@/styles/error.module.scss';

const cx = cn.bind(styles);

export default function UnknownError() {
  return (
    <div className={cx('container')}>
      <div className={cx('message')}>
        알 수 없는 오류가 발생했습니다.
        <br />
        지원팀에 문의해주세요.
      </div>
    </div>
  );
}
