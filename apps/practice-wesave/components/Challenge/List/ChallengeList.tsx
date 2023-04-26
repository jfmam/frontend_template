import ChallengeListItem, { ChallengeListItemType } from './ChallengeListItem';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeList.module.scss';

const cx = cn.bind(styles);

interface ChallengeListProps {
  items: Array<ChallengeListItemType>;
}

export default function List({ items }: ChallengeListProps) {
  return (
    <ul className={cx('list')}>
      {items.map((item: ChallengeListItemType, idx: number) => (
        <ChallengeListItem key={`${item.name}_${idx}`} challengeListItem={item} />
      ))}
    </ul>
  );
}
