import React from 'react';
import ListItem from './index';

export default {
  title: 'components/ListItem',
};

export const ListItemStories = () => {
  return (
    <ul className="list">
      <ListItem name="할 일 목록" targetAmount={10000} targetPeriod={['화,수,목']} percent={100} />
    </ul>
  );
};
