import cn from 'classnames/bind';
import styels from '@/styles/timer.module.scss';
import RangeBar from '@/components/timer/RangeBar';
import { getTimerInfo, useTimer } from '@/hooks/timer';
import { useEffect, useState } from 'react';

const cx = cn.bind(styels);

function formatNumberToTwoDigits(num: number): string {
  return num.toString().padStart(2, '0');
}

export default function Timer() {
  const [data, setData] = useState<any>();
  const { hours, minutes, seconds, percentage } = useTimer();

  useEffect(() => {
    setData(getTimerInfo());
  }, []);

  return (
    <div className={cx('timer')}>
      <RangeBar barColor="#3281f7" size={`${data?.monthlyPercentage}%`}>
        <div>{data?.monthlyPercentage}%</div>
        <div>이번달</div>
      </RangeBar>
      <RangeBar barColor="#bcfb4f" size={`${data?.dailyPercentage}%`}>
        <div>{data?.dailyPercentage}%</div>
        <div>오늘</div>
      </RangeBar>
      <RangeBar barColor="#695af2" size={`${100 - percentage}%`}>
        <div>{`${formatNumberToTwoDigits(hours)}:${formatNumberToTwoDigits(minutes)}:${formatNumberToTwoDigits(
          seconds,
        )}`}</div>
        <div>퇴근까지</div>
      </RangeBar>
    </div>
  );
}
