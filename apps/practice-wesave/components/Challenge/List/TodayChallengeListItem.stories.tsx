import { ChallengeResponse } from '@/common/challenge';

import ChallengeListItem from './TodayChallengeListItem';

export default {
  title: 'components/TodayChallengeListItem',
};

const mockListItem: ChallengeResponse = {
  id: 1,
  actionDay: ['월'],
  badge: 'art',
  createDate: '2020-11-25',
  endDate: '2020-11-26',
  goal: '50000',
  name: '아이폰 사기위한 돈 모으기',
  startDate: '2020-11-25',
  type: 'save',
  updateDate: '2020-1125',
};

export const ListItemStories = () => {
  return (
    <ul className="list">
      <ChallengeListItem challengeListItem={mockListItem} />
    </ul>
  );
};
