import { ReactElement, useMemo } from 'react';
import cn from 'classnames/bind';
import { format } from 'date-fns';
import styles from '@/styles/TodayChallenge.module.scss';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { useDateInfo } from '@/hooks/useTodayInfo';
import { getChellenges, useFetchChallenges } from '@/hooks/quries/challenge/useFetchChallenges';
import ChallengeList from '@/components/Challenge/List/ChallengeList';
import { ChallengeResponse } from '@/common/challenge';
import ChallengeRegister from '@/components/Challenge/ChallengeRegister';

const cx = cn.bind(styles);

interface TodayChallengeListProps {
  items: ChallengeResponse[];
}

function TodayChallengeList({ items }: TodayChallengeListProps) {
  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => format(today, 'yyyy-mm-dd'), [today]);
  const { day, month, weekday } = useDateInfo(today);

  return (
    <div className={cx('today-challenge')}>
      <div>
        <time dateTime={formattedDate} className={cx('date')}>
          {month}월 {day}일
        </time>
        <p className={cx('date')}>{weekday}요일</p>
      </div>
      <div className={cx('challenge-list')}>
        <ChallengeList items={items} />
      </div>
    </div>
  );
}
export default function TodayChallenge({ initialData }: { initialData: ChallengeResponse[] }) {
  const { data } = useFetchChallenges({ initialData });

  return <>{data && data?.length !== 0 ? <TodayChallengeList items={data} /> : <ChallengeRegister />}</>;
}

TodayChallenge.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  return {
    props: {
      initialData: await getChellenges(),
    },
  };
}
