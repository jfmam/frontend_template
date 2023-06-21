import React from 'react';
import { AchievementMock } from '@/mocks/achievement';

import AchievementList from './AchievementList';

export default {
  title: 'components/AchievementList',
};

export const AchievementListStories = () => {
  return (
    <AchievementList>
      {AchievementMock.map(v => (
        <AchievementList.Item item={v} key={v.id} />
      ))}
    </AchievementList>
  );
};
