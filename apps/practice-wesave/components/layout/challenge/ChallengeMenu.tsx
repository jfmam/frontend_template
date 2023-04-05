import { useState } from 'react';
import { TextBtn } from '@/components/button';
import styles from '@/styles/ChallengeLayout.module.scss';
import cn from 'classnames/bind';

const menuStyles = cn.bind(styles);

const challengeMenu = ['오늘의 챌린지', '달성 현황', '나의 성취', '챌린지 만들기'];
const backgroundStyle = ['today-challenge', 'achievement-status', 'my-achievement', 'make-challenge'];

export default function ChallengeMenu() {
  const [selectedNum, setSelectedNum] = useState<number>(0);

  const onClickMenu = (idx: number) => {
    setSelectedNum(idx);
  };

  const menuItem = challengeMenu.map((v: string, idx: number) => (
    <li className={menuStyles('menu-item', { selected: idx === selectedNum })} key={v}>
      <TextBtn onClick={() => onClickMenu(idx)}>{v}</TextBtn>
    </li>
  ));

  return <ul className={menuStyles('challenge-menu', backgroundStyle[selectedNum])}>{menuItem}</ul>;
}
