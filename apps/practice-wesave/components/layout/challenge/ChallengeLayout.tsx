import React, { ReactNode, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeLayout.module.scss';

import ChallengeMenu from './ChallengeMenu';

interface ChallengeLayoutProps {
  children: ReactNode;
}

const layoutStyles = cn.bind(styles);

export default function ChallengeLayout({ children }: ChallengeLayoutProps) {
  return (
    <div className={layoutStyles('challenge-layout')}>
      <ChallengeMenu />
      <div className={layoutStyles('challenge-content')}>{children}</div>
    </div>
  );
}
