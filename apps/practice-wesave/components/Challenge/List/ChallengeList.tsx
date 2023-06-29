import cn from 'classnames/bind';
import styles from '@/styles/ChallengeList.module.scss';
import { ChallengeResponse } from '@/common/challenge';

import TodayChallengeListItem from './TodayChallengeListItem';
import { useToggleChallenges, ChallengeStatus } from '@/hooks/quries/challenge/useToggleChallenges';
import { PaginationResponse } from '@/common/pagination';

const cx = cn.bind(styles);

interface ChallengeListProps {
  items: PaginationResponse<ChallengeResponse>[];
}

export default function ChallengeList({ items }: ChallengeListProps) {
  const { mutateAsync } = useToggleChallenges();

  const handleToggleStatus = (id: number) => (status: ChallengeStatus) => {
    mutateAsync({ id, status });
  };

  return (
    <ul className={cx('list')}>
      {items.map(item => (
        <>
          {item.items.map(v => (
            <TodayChallengeListItem onClick={handleToggleStatus(v.id)} key={`${v.id}`} challengeListItem={v} />
          ))}
        </>
      ))}
    </ul>
  );
}
