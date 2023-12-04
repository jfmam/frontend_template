import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames/bind';
import { ChallengeRegister, InfiniteScroller } from '@/components/section';
import { AchievementBadge } from '@/components/atom';
import styles from '@/styles/MyAchievement.module.scss';
import { AchivementResponse } from '@/common';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useFetchMyAchievements } from '@/hooks/quries/challenge/useFetchMyAchievement';

const MyAchievementDetail = dynamic(() => import('@/components/section/Achieve/MyAchievementDetail'), { ssr: false });

const cx = cn.bind(styles);

interface MyAchievementContainerProps {
  token: string;
}

export default function MyAchievementContainer({ token }: MyAchievementContainerProps) {
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailItem, setDetailItem] = useState<AchivementResponse | null>(null);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error } = useFetchMyAchievements(token);

  const onClickListItem = (value: AchivementResponse) => {
    setIsOpenDetail(true);
    setDetailItem(value);
  };

  const closeDetail = () => {
    setIsOpenDetail(false);
    setDetailItem(null);
  };

  if (isError) {
    throw error;
  }

  if (data?.pages[0].items.length === 0 || !data?.pages[0].items) {
    return (
      <div className={cx('myachievement')}>
        <ChallengeRegister />
      </div>
    );
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
      {detailItem && (
        <MyAchievementDetail
          item={detailItem as AchivementResponse}
          onRequestClose={closeDetail}
          isOpen={isOpenDetail}
        />
      )}
    </>
  );
}
