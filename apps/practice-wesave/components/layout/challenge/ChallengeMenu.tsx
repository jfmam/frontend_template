import { useState } from 'react';
import Link from 'next/link';
import { TextBtn } from '@/components/button';
import styles from '@/styles/ChallengeLayout.module.scss';
import cn from 'classnames/bind';
import { ChallengeMenuType, useChallengeMenuDispatch, useChallengeMenuState } from './ChallengeMenuContext';

const menuStyles = cn.bind(styles);

const challengeMenu = ['오늘의 챌린지', '달성 현황', '나의 성취', '챌린지 만들기'];
const backgroundStyle = ['today-challenge', 'achievement-status', 'my-achievement', 'make-challenge'];

const selectChallengeMenuMapLink: { [key: string]: string } = {
  '오늘의 챌린지': 'today-challenge',
  '달성 현황': 'achievement-status',
  '나의 성취': 'my-achievement',
  '챌린지 만들기': 'register',
};

export default function ChallengeMenu() {
  const [selectedNum, setSelectedNum] = useState<number>(0);
  const dispatch = useChallengeMenuDispatch();

  const onClickMenu = (v: string, idx: number) => {
    setSelectedNum(idx);
    dispatch(selectChallengeMenuMapLink[v] as ChallengeMenuType);
  };

  const menuItem = challengeMenu.map((v: string, idx: number) => (
    <li className={menuStyles('menu-item', { selected: idx === selectedNum })} key={v}>
      <TextBtn onClick={() => onClickMenu(v, idx)}>{v}</TextBtn>
    </li>
  ));

  return <ul className={menuStyles('challenge-menu', backgroundStyle[selectedNum])}>{menuItem}</ul>;
}
