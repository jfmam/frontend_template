import React from 'react';
import { AchievementResponseMock } from '@/mocks/achievement';

import AchievementList from './AchievementList';

export default {
  title: 'components/AchievementList',
};

export const AchievementListStories = () => {
  return (
    <AchievementList>
      {AchievementResponseMock.map(v => (
        <AchievementList.Item item={v} key={v.id} />
      ))}
    </AchievementList>
  );
};
