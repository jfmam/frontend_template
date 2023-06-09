import { basename } from 'path';
import Link from 'next/link';
import styles from '@/styles/ChallengeNavigation.module.scss';
import cn from 'classnames/bind';
import { ChallengeMenuType, useChallengeMenuDispatch } from './ChallengeMenuContext';
import { useRouter } from 'next/router';

const cx = cn.bind(styles);

const challengeMenu = ['오늘의 챌린지', '달성 현황', '나의 성취', '챌린지 만들기'];

const selectChallengeMenuMapLink: { [key: string]: string } = {
  '오늘의 챌린지': 'today-challenge',
  '달성 현황': 'achievement-status',
  '나의 성취': 'my-achievement',
  '챌린지 만들기': 'register',
};

export default function ChallengeMenu() {
  const dispatch = useChallengeMenuDispatch();
  const router = useRouter();

  const onClickMenu = (v: string) => {
    dispatch(selectChallengeMenuMapLink[v] as ChallengeMenuType);
  };

  const menuItem = challengeMenu.map((v: string) => (
    <li
      className={cx('navigation-item', { selected: selectChallengeMenuMapLink[v] === basename(router.asPath) })}
      key={v}
    >
      <Link className={cx('link')} key={v} href={`${selectChallengeMenuMapLink[v]}`} onClick={() => onClickMenu(v)}>
        {v}
      </Link>
    </li>
  ));

  return <ul className={cx('challenge-naviation', basename(router.asPath))}>{menuItem}</ul>;
}
