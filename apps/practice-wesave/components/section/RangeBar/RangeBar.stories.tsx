import React from 'react';
import RangeBar from '.';

export default {
  title: 'Components/RangeBar',
};

export const RangeBarStories = () => (
  <RangeBar barColor="#32f415" size="245px">
    <>
      <div>오늘까지</div>
      <div>72%</div>
    </>
  </RangeBar>
);
