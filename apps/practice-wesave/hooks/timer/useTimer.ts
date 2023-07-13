import { useEffect, useState } from 'react';
import { eachDayOfInterval, getDay } from 'date-fns';
import { Income } from '@/common';
import LocalStorage from '@/utils/storage';

function countWeekdaysInRange(startDate: Date, endDate: Date, targetWeekdays: number[]): number {
  const allDaysInRange: Date[] = eachDayOfInterval({ start: startDate, end: endDate });

  const count: number = allDaysInRange.reduce((total, day) => {
    const weekday: number = getDay(day); // 0 (일요일)부터 6 (토요일)까지의 숫자로 요일을 나타냅니다.

    if (targetWeekdays.includes(weekday)) {
      return total + 1;
    }

    return total;
  }, 0);

  return count;
}

function calculateWorkdays(startDay: Date, endDay: Date, targetWeekdays: number[]): number {
  const workdayCount: number = countWeekdaysInRange(startDay, endDay, targetWeekdays);

  return workdayCount;
}

function calculateWorkPercentageByTimer(
  startTime: number,
  endTime: number,
): { totalSeconds: number; workedSeconds: number; percentage: number } {
  const currentSeconds: number = Math.floor((Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000);

  const totalSeconds: number = (endTime - startTime) * 3600;
  const workedSeconds: number = currentSeconds - startTime * 3600;

  const percentage: number = (workedSeconds / totalSeconds) * 100;

  return {
    totalSeconds,
    workedSeconds,
    percentage: percentage <= 100 ? Math.round(percentage) : 100,
  };
}

function calculateWorkPercentageByPayday(
  payday: number,
  targetWeekdays: number[],
): { totalDays: number; workingDays: number; percentage: number } {
  const currentDate: Date = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth();

  const startDate: Date = new Date(currentYear, currentMonth, payday);
  const endDate: Date = new Date(currentYear, currentMonth + 1, payday);
  const totalDays: number = calculateWorkdays(startDate, endDate, targetWeekdays);
  const workingDays: number = calculateWorkdays(startDate, currentDate, targetWeekdays);
  const percentage: number = (workingDays / totalDays) * 100;

  return {
    totalDays,
    workingDays,
    percentage: percentage <= 100 ? Math.round(percentage) : 100,
  };
}

function calculateWorkPercentageByHours(
  startTime: number,
  endTime: number,
): { totalMinutes: number; workedMinutes: number; percentage: number } {
  const currentHour: number = new Date().getHours();
  const currentMinute: number = new Date().getMinutes();

  const totalMinutes: number = (endTime - startTime) * 60;
  const workedMinutes: number = (currentHour - startTime) * 60 + currentMinute;

  const percentage: number = (workedMinutes / totalMinutes) * 100;

  return {
    totalMinutes,
    workedMinutes,
    percentage: percentage <= 100 ? Math.round(percentage) : 100,
  };
}

export const getTimerInfo = () => {
  if (typeof window === 'undefined') {
    throw new Error('서버 사이드 렌더링에서는 localStorage를 사용할 수 없습니다.');
  }
  const value = LocalStorage.getItem('income');

  if (!value) {
    throw new Error('소득정보가 존재하지 않습니다.');
  }

  const { income, workday, quitTime, startTime, payday }: Income = JSON.parse(value);
  const { percentage: monthlyPercentage, totalDays, workingDays } = calculateWorkPercentageByPayday(payday, workday);
  const currentMothIncome = (income / workingDays).toFixed(1);

  const todayIncome = income / totalDays;
  const { percentage: dailyPercentage, workedMinutes } = calculateWorkPercentageByHours(startTime, quitTime);
  const currentIncome = (todayIncome / workedMinutes).toFixed(1);
  const { percentage: timerPercentage, workedSeconds } = calculateWorkPercentageByTimer(startTime, quitTime);

  return {
    monthlyPercentage,
    currentMothIncome,
    dailyPercentage,
    currentIncome,
    timerPercentage,
    workedSeconds,
  };
};

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, percentage: 100 });

  useEffect(() => {
    const value = LocalStorage.getItem('income');

    if (!value) {
      throw new Error('소득정보가 존재하지 않습니다.');
    }

    const { quitTime, startTime }: Income = JSON.parse(value);
    const interval = setInterval(() => {
      const currentHour: number = new Date().getHours();
      const currentMinute: number = new Date().getMinutes();
      const currentSecond: number = new Date().getSeconds();
      if (currentHour < startTime || currentHour >= quitTime) {
        // startTime보다 이전이거나 quitTime보다 이후인 경우
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, percentage: 0 });
        return;
      }
      let remainingHours: number = quitTime - currentHour;
      let remainingMinutes: number = 59 - currentMinute;
      let remainingSeconds: number = 59 - currentSecond;

      if (currentMinute === 59 && currentSecond === 59) {
        remainingHours--;
        remainingMinutes = 0;
        remainingSeconds = 0;
      } else if (currentSecond === 59) {
        remainingMinutes--;
        remainingSeconds = 0;
      }

      const percentage =
        ((remainingHours * 3600 + remainingMinutes * 60 + remainingSeconds) / ((quitTime - startTime) * 3600)) * 100;

      setTimeLeft({ hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds, percentage });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
