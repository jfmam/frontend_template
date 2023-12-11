import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames/bind';
import { AchievementList, ChallengeRegister, InfiniteScroller } from '@/components/section';
import styles from '@/styles/achievement-status.module.scss';
import { useFetchAchievements } from '@/hooks/quries/challenge/useFetchAchievements';
import { AchivementResponse } from '@/common';

const AchievementStatusDetail = dynamic(() => import('@/components/section/Achieve/AchievementStatusDetail'), {
  ssr: false,
});

const cx = cn.bind(styles);

interface AchievementListProps {
  token: string;
}

export default function AchievementContainer({ token }: AchievementListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError } = useFetchAchievements(token);
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

  if (isError) {
    throw error;
  }

  if (data?.pages[0].items.length === 0 || !data?.pages[0].items) {
    return (
      <div className={cx('achievement-status')}>
        <ChallengeRegister />
      </div>
    );
  }

  return (
    <AchievementList>
      <InfiniteScroller
        fetchNextPage={() => fetchNextPage()}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      >
        <div className={cx('achievement-status')}>
          {data?.pages.map(page => (
            <Fragment key={page.offset}>
              {page.items?.map(v => (
                <AchievementList.Item item={v} key={v.id} onClick={() => onClickListItem(v)} />
              ))}
            </Fragment>
          ))}
        </div>
        {detailItem && (
          <AchievementStatusDetail
            item={detailItem as AchivementResponse}
            onRequestClose={closeDetail}
            isOpen={isOpenDetail}
          />
        )}
      </InfiniteScroller>
    </AchievementList>
  );
}
