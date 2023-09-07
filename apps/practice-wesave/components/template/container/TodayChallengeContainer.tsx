import { Fragment, useMemo } from 'react';
import cn from 'classnames/bind';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from 'react-query';
import { ChallengeRegister, ChallengeList, InfiniteScroller } from '@/components/section';
import styles from '@/styles/TodayChallenge.module.scss';
import { ChallengeResponse, PaginationResponse } from '@/common';
import { useDateInfo } from '@/hooks/useTodayInfo';
import { ChallengeStatus, useToggleChallenges } from '@/hooks/quries/challenge/useToggleChallenges';

const cx = cn.bind(styles);

interface TodayChallengeContainerProps {
  data: InfiniteData<PaginationResponse<ChallengeResponse>> | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<PaginationResponse<ChallengeResponse>, AxiosError<unknown, any>>>;
}

export default function TodayChallengeContainer({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: TodayChallengeContainerProps) {
  const { mutateAsync } = useToggleChallenges();
  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => format(today, 'yyyy-mm-dd'), [today]);
  const { day, month, weekday } = useDateInfo(today);

  const handleItem = (id: number) => (status: ChallengeStatus) => {
    mutateAsync({ id, status });
  };

  if (data?.pages[0].error) {
    throw new Error(data?.pages[0].error.message, { cause: { type: data?.pages[0].error.type } });
  }

  if (!data?.pages || data?.pages.length === 0) {
    return <ChallengeRegister />;
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
                  <ChallengeList.Item onClick={() => handleItem(v.id)} item={v} key={v.id} />
                ))}
              </Fragment>
            ))}
          </InfiniteScroller>
        </ChallengeList>
      </div>
    </div>
  );
}
