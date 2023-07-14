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
import InfiniteScroller from '@/components/InfiniteScroller';
import { PaginationResponse } from '@/common/pagination';
import { dehydrate, QueryClient } from 'react-query';
import { ChallengeStatus, useToggleChallenges } from '@/hooks/quries/challenge/useToggleChallenges';

const cx = cn.bind(styles);

interface TodayChallengeListProps {
  pages: PaginationResponse<ChallengeResponse>[];
}

function TodayChallengeList({ pages }: TodayChallengeListProps) {
  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => format(today, 'yyyy-mm-dd'), [today]);
  const { day, month, weekday } = useDateInfo(today);
  const { mutateAsync } = useToggleChallenges();

  const handleItem = (id: number) => (status: ChallengeStatus) => {
    mutateAsync({ id, status });
  };

  return (
    <div className={cx('today-challenge')}>
      <div>
        <time dateTime={formattedDate} className={cx('date')}>
          {month}월 {day}일
        </time>
        <p className={cx('date')}>{weekday}요일</p>
      </div>
      <div className={cx('challenge-list')}>
        <ChallengeList>
          {pages.map(page => (
            <>
              {page.items?.map(v => (
                <ChallengeList.Item onClick={() => handleItem(v.id)} item={v} key={v.id} />
              ))}
            </>
          ))}
        </ChallengeList>
      </div>
    </div>
  );
}
export default function TodayChallenge() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchChallenges();

  return (
    <>
      {data?.pages && data?.pages.length !== 0 ? (
        <InfiniteScroller
          fetchNextPage={() => fetchNextPage()}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <TodayChallengeList pages={data.pages} />
        </InfiniteScroller>
      ) : (
        <ChallengeRegister />
      )}
    </>
  );
}

TodayChallenge.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery('challenges', () => getChellenges(), { staleTime: 1000 });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
