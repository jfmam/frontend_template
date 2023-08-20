import { ReactElement, useMemo, Fragment } from 'react';
import cn from 'classnames/bind';
import { format } from 'date-fns';
import styles from '@/styles/TodayChallenge.module.scss';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { useDateInfo } from '@/hooks/useTodayInfo';
import { getChellenges, useFetchChallenges } from '@/hooks/quries/challenge/useFetchChallenges';
import ChallengeList from '@/components/Challenge/List/ChallengeList';
import ChallengeRegister from '@/components/Challenge/ChallengeRegister';
import InfiniteScroller from '@/components/InfiniteScroller';
import { dehydrate, QueryClient } from 'react-query';
import { ChallengeStatus, useToggleChallenges } from '@/hooks/quries/challenge/useToggleChallenges';

const cx = cn.bind(styles);

export default function TodayChallenge() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchChallenges();
  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => format(today, 'yyyy-mm-dd'), [today]);
  const { day, month, weekday } = useDateInfo(today);
  const { mutateAsync } = useToggleChallenges();

  const handleItem = (id: number) => (status: ChallengeStatus) => {
    mutateAsync({ id, status });
  };

  return (
    <>
      {data?.pages && data?.pages.length !== 0 ? (
        <div className={cx('today-challenge')}>
          <div>
            <time dateTime={formattedDate} className={cx('date')}>
              {month}월 {day}일
            </time>
            <p className={cx('date')}>{weekday}요일</p>
          </div>
          <div className={cx('challenge-list')}>
            <ChallengeList>
              <InfiniteScroller
                fetchNextPage={() => fetchNextPage()}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              >
                {data.pages.map(({ items, offset }) => (
                  <Fragment key={offset}>
                    {items?.map(v => (
                      <ChallengeList.Item onClick={() => handleItem(v.id)} item={v} key={v.id} />
                    ))}
                  </Fragment>
                ))}
              </InfiniteScroller>
            </ChallengeList>
          </div>
        </div>
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
