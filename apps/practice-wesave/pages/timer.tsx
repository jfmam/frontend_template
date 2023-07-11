import cn from 'classnames/bind';
import styels from '@/styles/timer.module.scss';
import RangeBar from '@/components/timer/RangeBar';

const cx = cn.bind(styels);

export default function Timer() {
  return (
    <div className={cx('timer')}>
      <RangeBar barColor="#3281f7" size="45%">
        <>
          <div>45%</div>
          <div>이번달</div>
        </>
      </RangeBar>
      <RangeBar barColor="#bcfb4f" size="72.8%">
        <>
          <div>72.8%</div>
          <div>이번달</div>
        </>
      </RangeBar>
      <RangeBar barColor="#695af2" size="100%">
        <>
          <div>00:31:40</div>
          <div>퇴근까지</div>
        </>
      </RangeBar>
    </div>
  );
}
