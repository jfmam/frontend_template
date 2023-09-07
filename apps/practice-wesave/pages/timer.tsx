import { useRef, useState } from 'react';
import cn from 'classnames/bind';
import Slider from 'react-slick';
import styels from '@/styles/timer.module.scss';
import { RangeBar } from '@/components/section';
import { useDailyInfo, useMonthlyInfo, useTimer } from '@/hooks/timer';

const cx = cn.bind(styels);

function formatNumberToTwoDigits(num: number): string {
  return num.toString().padStart(2, '0');
}

function MonthlyRangeBar() {
  const { monthlyPercentage } = useMonthlyInfo();
  return (
    <RangeBar barColor="#3281f7" size={`${monthlyPercentage}%`}>
      <div>{monthlyPercentage}%</div>
      <div>이번달</div>
    </RangeBar>
  );
}

function DailyRangeBar() {
  const { dailyPercentage } = useDailyInfo();
  return (
    <RangeBar barColor="#bcfb4f" size={`${dailyPercentage}%`}>
      <div>{dailyPercentage}%</div>
      <div>오늘</div>
    </RangeBar>
  );
}

function TimerRangeBar() {
  const { hours, minutes, percentage, seconds } = useTimer();
  return (
    <RangeBar barColor="#695af2" size={`${100 - percentage}%`}>
      <div>{`${formatNumberToTwoDigits(hours)}:${formatNumberToTwoDigits(minutes)}:${formatNumberToTwoDigits(
        seconds,
      )}`}</div>
      <div>퇴근까지</div>
    </RangeBar>
  );
}

export default function Timer() {
  const [barIndex, setBarIndex] = useState(0);
  let sliderRef = useRef<{ slickGoTo: Function } | null>(null);
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 425,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          beforeChange: (_: any, next: number) => setBarIndex(next),
        },
      },
    ],
  };

  return (
    <>
      {/* {!isMobile && ( */}
      <div className={cx('button-container')}>
        <button
          className={cx('button', { 'button-active': barIndex === 0 })}
          onClick={() => sliderRef.current?.slickGoTo(0)}
        >
          이번달
        </button>
        <button
          className={cx('button', { 'button-active': barIndex === 1 })}
          onClick={() => sliderRef.current?.slickGoTo(1)}
        >
          오늘
        </button>
        <button
          className={cx('button', { 'button-active': barIndex === 2 })}
          onClick={() => sliderRef.current?.slickGoTo(2)}
        >
          타이머
        </button>
      </div>
      {/* )} */}
      <Slider ref={slider => (sliderRef.current = slider)} {...settings}>
        <MonthlyRangeBar />
        <DailyRangeBar />
        <TimerRangeBar />
      </Slider>
    </>
  );
}
