import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeGuideLayout.module.scss';

import { PrimaryBtn } from '../../atom';

const cx = cn.bind(styles);

interface ChallengeGuideLayoutProps {
  icon: { src: string; width: number; height: number };
  description: { first: string; second: string };
  onClickButton: () => void;
}

export default function AccountGuideLayout({ icon, description, onClickButton }: ChallengeGuideLayoutProps) {
  return (
    <div>
      <div>
        <Image sizes="(max-width: 425px) 70px, 95px" width={icon.width} height={icon.height} alt="" src={icon.src} />
      </div>
      <div>
        <p className={cx('description')}>
          {description.first}
          <br />
          {description.second}
        </p>
      </div>
      <div className={cx('confirm-container')}>
        <PrimaryBtn onClick={onClickButton} className={cx('confirm')}>
          로그인
        </PrimaryBtn>
      </div>
    </div>
  );
}
