import { Fragment, useMemo } from 'react';
import cn from 'classnames/bind';
import { format } from 'date-fns';
import { ChallengeRegister, ChallengeList, InfiniteScroller } from '@/components/section';
import styles from '@/styles/TodayChallenge.module.scss';
import { useDateInfo } from '@/hooks/useTodayInfo';
import { useToggleChallenges } from '@/hooks/quries/challenge/useToggleChallenges';
import { useFetchChallenges } from '@/hooks/quries/challenge/useFetchChallenges';

const cx = cn.bind(styles);

interface TodayChallengeContainerProps {
  token: string;
}

export default function TodayChallengeContainer({ token }: TodayChallengeContainerProps) {
  const { mutateAsync } = useToggleChallenges();
  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => format(today, 'yyyy-mm-dd'), [today]);
  const { day, month, weekday } = useDateInfo(today);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error } = useFetchChallenges(token);

  const handleItem = (id: number) => (status: boolean) => {
    mutateAsync({ id, status });
  };

  if (isError) {
    throw error;
  }

  if (data?.pages[0].items.length === 0 || !data?.pages[0].items) {
    return (
      <div className={cx('today-challenge')}>
        <ChallengeRegister />
      </div>
    );
  }

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
          <InfiniteScroller
            fetchNextPage={() => fetchNextPage()}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            {data.pages.map(({ items, offset }) => (
              <Fragment key={offset}>
                {items?.map(v => (
                  <ChallengeList.Item onClick={handleItem(v.id)} item={v} key={v.id} />
                ))}
              </Fragment>
            ))}
          </InfiniteScroller>
        </ChallengeList>
      </div>
    </div>
  );
}
