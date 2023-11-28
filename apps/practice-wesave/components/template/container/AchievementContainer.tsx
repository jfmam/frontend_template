import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { AxiosError } from 'axios';
import cn from 'classnames/bind';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from 'react-query';
import { AchievementList, ChallengeRegister, InfiniteScroller } from '@/components/section';
import styles from '@/styles/achievement-status.module.scss';
import { PaginationResponse, AchivementResponse } from '@/common';

const AchievementStatusDetail = dynamic(() => import('@/components/section/Achieve/AchievementStatusDetail'), {
  ssr: false,
});

const cx = cn.bind(styles);

interface AchievementListProps {
  data: InfiniteData<PaginationResponse<AchivementResponse>> | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<PaginationResponse<AchivementResponse>, AxiosError<unknown, any>>>;
}

export default function AchievementContainer({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: AchievementListProps) {
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailItem, setDetailItem] = useState<AchivementResponse | null>(null);

  const onClickListItem = (value: AchivementResponse) => {
    setIsOpenDetail(true);
    setDetailItem(value);
  };

  const closeDetail = () => {
    setIsOpenDetail(false);
    setDetailItem(null);
  };

  if (data?.pages[0].error) {
    throw new Error(data?.pages[0].error.message, { cause: { type: data?.pages[0].error.type } });
  }

  if (data?.pages[0].items.length === 0 || !data?.pages[0].items) {
    return (
      <div className={cx('achievement-status')}>
        <ChallengeRegister />
      </div>
    );
  }

  return (
    <InfiniteScroller
      fetchNextPage={() => fetchNextPage()}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    >
      <div className={cx('achievement-status')}>
        <AchievementList>
          {data?.pages.map(page => (
            <Fragment key={page.offset}>
              {page.items?.map(v => (
                <AchievementList.Item item={v} key={v.id} onClick={() => onClickListItem(v)} />
              ))}
            </Fragment>
          ))}
        </AchievementList>
      </div>
      {detailItem && (
        <AchievementStatusDetail
          item={detailItem as AchivementResponse}
          onRequestClose={closeDetail}
          isOpen={isOpenDetail}
        />
      )}
    </InfiniteScroller>
  );
}
