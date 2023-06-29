import { ReactElement, Suspense, useState } from 'react';
import cn from 'classnames/bind';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { getAchivements, useFetchAchievements } from '@/hooks/quries/challenge/useFetchAchievements';
import { AchivementResponse } from '@/common/achievement';
import AchievementList from '@/components/Achieve/List/AchievementList';
import ChallengeRegister from '@/components/Challenge/ChallengeRegister';
import styles from '@/styles/achievement-status.module.scss';
import AchievementStatusDetail from '@/components/Achieve/AchievementStatusDetail';
import { dehydrate, QueryClient } from 'react-query';
import InfiniteScroller from '@/components/InfiniteScroller';

const cx = cn.bind(styles);

export default function AchievementStatus() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchAchievements();
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

  console.log(data);
  return (
    <>
      {data?.pages && data?.pages.length !== 0 ? (
        <InfiniteScroller
          fetchNextPage={() => fetchNextPage()}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <AchievementList className={cx('achievement-status')}>
            {data.pages.map(page => (
              <>
                {page.items?.map(v => (
                  <AchievementList.Item item={v} key={v.id} onClick={() => onClickListItem(v)} />
                ))}
              </>
            ))}
          </AchievementList>
          {isOpenDetail && (
            <Suspense fallback={<div>Loading...</div>}>
              <AchievementStatusDetail
                item={detailItem as AchivementResponse}
                onRequestClose={closeDetail}
                isOpen={isOpenDetail}
              />
            </Suspense>
          )}
        </InfiniteScroller>
      ) : (
        <ChallengeRegister />
      )}
    </>
  );
}

AchievementStatus.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery('achievements', () => getAchivements(), { staleTime: 1000 });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
