import React from 'react';
import ChallengeListItem, { ChallengeListItemType } from './ChallengeListItem';

export default {
  title: 'components/ListItem',
};

const mockListItem: ChallengeListItemType = {
  hasCheckBtn: false,
  name: '할 일 목록',
  percent: 100,
  targetAmount: 10000,
  targetPeriod: ['화,수'],
};

export const ListItemStories = () => {
  return (
    <ul className="list">
      <ChallengeListItem challengeListItem={mockListItem} />
    </ul>
  );
};
