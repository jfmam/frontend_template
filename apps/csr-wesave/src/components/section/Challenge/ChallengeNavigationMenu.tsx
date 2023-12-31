import { basename } from 'path';
import { Link, useLocation } from 'react-router-dom';
import styles from '@/styles/ChallengeNavigation.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

const selectChallengeMenuMapLink: { [key: string]: string } = {
  '오늘의 챌린지': 'today-challenge',
  '달성 현황': 'achievement-status',
  '나의 성취': 'my-achievement',
  '챌린지 만들기': 'register',
};

export default function ChallengeNavigationMenu() {
  const router = useLocation();

  const menuItem = Object.keys(selectChallengeMenuMapLink).map((v: string) => (
    <li
      className={cx('navigation-item', { selected: selectChallengeMenuMapLink[v] === basename(router.pathname) })}
      key={v}
    >
      <Link className={cx('link')} key={v} to={`${selectChallengeMenuMapLink[v]}`}>
        {v}
      </Link>
    </li>
  ));

  return <ul className={cx('challenge-naviation', basename(router.pathname))}>{menuItem}</ul>;
}
