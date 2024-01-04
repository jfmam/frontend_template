import { NavLink, useLocation } from 'react-router-dom';
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
  const baseName = router.pathname.split('/')[2];
  const menuItem = Object.keys(selectChallengeMenuMapLink).map((v: string) => (
    <li className={cx('navigation-item', { selected: selectChallengeMenuMapLink[v] === baseName })} key={v}>
      <NavLink  className={cx('link')} key={v} to={`/challenge/${selectChallengeMenuMapLink[v]}`}>
        {v}
      </NavLink>
    </li>
  ));

  return <ul className={cx('challenge-naviation', baseName)}>{menuItem}</ul>;
}
