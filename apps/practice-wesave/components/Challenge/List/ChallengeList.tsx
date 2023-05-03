import styles from '@/styles/ChallengeList.module.scss';
import cn from 'classnames/bind';
import { ChallengeResponse } from '@/common/challenge';

import ChallengeListItem from './ChallengeListItem';

const cx = cn.bind(styles);

interface ChallengeListProps {
  items: Array<ChallengeResponse>;
}

export default function ChallengeList({ items }: ChallengeListProps) {
  return (
    <ul className={cx('list')}>
      {items.map((item: ChallengeResponse, idx: number) => (
        <ChallengeListItem key={`${item.name}_${idx}`} challengeListItem={item} />
      ))}
    </ul>
  );
}
