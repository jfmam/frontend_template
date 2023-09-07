import { Fragment, useState, lazy } from 'react';
import cn from 'classnames/bind';
import { AxiosError } from 'axios';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from 'react-query';
import { ChallengeRegister, InfiniteScroller } from '@/components/section';
import { AchievementBadge } from '@/components/atom';
import styles from '@/styles/MyAchievement.module.scss';
import { PaginationResponse, AchivementResponse } from '@/common';
import useMediaQuery from '@/hooks/useMediaQuery';

const MyAchievementDetail = lazy(() => import('@/components/section/Achieve/MyAchievementDetail'));

const cx = cn.bind(styles);

interface MyAchievementContainerProps {
  data: InfiniteData<PaginationResponse<AchivementResponse>> | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<PaginationResponse<AchivementResponse>, AxiosError<unknown, any>>>;
}

export default function MyAchievementContainer({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: MyAchievementContainerProps) {
  const isLarge = useMediaQuery('(min-width: 1024px)');
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

  if (!data?.pages || data?.pages.length === 0) {
    return <ChallengeRegister />;
  }

  return (
    <>
      <InfiniteScroller
        fetchNextPage={() => fetchNextPage()}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      >
        <div className={cx('myachievement')}>
          <div className={cx('badge-container')}>
            {data.pages?.map(page => (
              <Fragment key={page.offset}>
                {page.items?.map(v => (
                  <AchievementBadge
                    onClick={() => onClickListItem(v)}
                    key={v.id}
                    type={v.badge}
                    lengthType={isLarge ? undefined : 'small'}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </InfiniteScroller>
      {isOpenDetail && (
        <MyAchievementDetail
          item={detailItem as AchivementResponse}
          onRequestClose={closeDetail}
          isOpen={isOpenDetail}
        />
      )}
    </>
  );
}
