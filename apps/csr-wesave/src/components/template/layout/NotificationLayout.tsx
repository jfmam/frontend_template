import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeGuideLayout.module.scss';

const cx = cn.bind(styles);

interface NotificationLayoutProps {
  icon: { src: string };
  children: ReactNode;
}

export default function NotificationLayout({ icon, children }: NotificationLayoutProps) {
  return (
    <div className={cx('container')}>
      <div className={cx('icon')}>
        <img width="100%" height="100%" sizes="(max-width: 425px) 70px, 95px" alt="" src={icon.src} />
      </div>
      {children}
    </div>
  );
}

interface DescriptionProps {
  children: ReactNode;
}

function Description({ children }: DescriptionProps) {
  return (
    <div>
      <p className={cx('description')}>{children}</p>
    </div>
  );
}

interface ConfirmProps {
  children: ReactNode;
}

function Confirm({ children }: ConfirmProps) {
  return <div className={cx('confirm-container')}>{children}</div>;
}

NotificationLayout.Description = Description;
NotificationLayout.Confirm = Confirm;
