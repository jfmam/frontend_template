import cn from 'classnames/bind';
import styles from '@/styles/ChallengeGuideLayout.module.scss';

import { PrimaryBtn } from '@/components/atom';

const cx = cn.bind(styles);

interface ChallengeGuideLayoutProps {
  icon: { src: string; width: number; height: number };
  description: { first: string; second: string };
  onClickButton: () => void;
}

export default function ChallengeGuideLayout({ icon, description, onClickButton }: ChallengeGuideLayoutProps) {
  return (
    <div>
      <div>
        <img width={icon.width} height={icon.height} alt="" src={icon.src} />
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
          챌린지 만들기
        </PrimaryBtn>
      </div>
    </div>
  );
}
