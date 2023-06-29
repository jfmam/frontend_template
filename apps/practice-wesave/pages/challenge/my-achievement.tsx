import { ReactElement, Suspense, useState } from 'react';
import cn from 'classnames/bind';
import { dehydrate, QueryClient } from 'react-query';

import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import styles from '@/styles/MyAchievement.module.scss';
import AchievementBadge from '@/components/Achieve/AchievementBadge';
import useMediaQuery from '@/hooks/useMediaQuery';
import MyAchievementDetail from '@/components/Achieve/MyAchievementDetail';
import { AchivementResponse } from '@/common/achievement';
import { getMyAchivements, useFetchMyAchievements } from '@/hooks/quries/challenge/useFetchMyAchivement';
import ChallengeRegister from '@/components/Challenge/ChallengeRegister';
import InfiniteScroller from '@/components/InfiniteScroller';

const cx = cn.bind(styles);
export default function MyAchievement() {
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailItem, setDetailItem] = useState<AchivementResponse | null>(null);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchMyAchievements();

  const onClickListItem = (value: AchivementResponse) => {
    setIsOpenDetail(true);
    setDetailItem(value);
  };

  const closeDetail = () => {
    setIsOpenDetail(false);
    setDetailItem(null);
  };

  return (
    <>
      {data?.pages && data?.pages.length !== 0 ? (
        <>
          <InfiniteScroller
            fetchNextPage={() => fetchNextPage()}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            <div className={cx('myachievement')}>
              <div className={cx('badge-container')}>
                {data.pages?.map(page => (
                  <>
                    {page.items?.map(v => (
                      <AchievementBadge
                        onClick={() => onClickListItem(v)}
                        key={v.id}
                        type={v.badge}
                        lengthType={isLarge ? undefined : 'small'}
                      />
                    ))}
                  </>
                ))}
              </div>
            </div>
          </InfiniteScroller>
          {isOpenDetail && (
            <Suspense fallback={<div>Loading...</div>}>
              <MyAchievementDetail
                item={detailItem as AchivementResponse}
                onRequestClose={closeDetail}
                isOpen={isOpenDetail}
              />
            </Suspense>
          )}
        </>
      ) : (
        <ChallengeRegister />
      )}
    </>
  );
}

MyAchievement.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery('my-achievements', () => getMyAchivements(), { staleTime: 1000 });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
