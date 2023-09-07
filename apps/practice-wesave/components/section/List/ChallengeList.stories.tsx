import React from 'react';
import { challengeListMock } from '@/mocks/challenge-list';

import ChallengeList from './ChallengeList';

export default {
  title: 'components/ListItem',
};

export const ChallengeListStories = () => {
  return <ChallengeList items={challengeListMock} />;
};
