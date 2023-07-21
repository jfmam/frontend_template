import { useEffect, useState } from 'react';
import { eachDayOfInterval, getDay, set, intervalToDuration, differenceInSeconds } from 'date-fns';
import { Income } from '@/common';
import LocalStorage from '@/utils/storage';

import { isTodayWorkingDay } from './utils';

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

function calculateWorkPercentageByPayday(
  payday: number,
  targetWeekdays: number[],
): { totalDays: number; workingDays: number; percentage: number } {
  const currentDate: Date = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth();
  const currentDay: number = currentDate.getDate();

  // currentDay < payday 일 때로 초기화
  let startDate: Date = new Date(currentYear, currentMonth - 1, payday);
  let endDate: Date = new Date(currentYear, currentMonth, payday);

  if (currentDay > payday) {
    startDate = new Date(currentYear, currentMonth, payday);
    endDate = new Date(currentYear, currentMonth + 1, payday);
  }

  const totalDays: number = calculateWorkdays(startDate, endDate, targetWeekdays);
  const workingDays: number = calculateWorkdays(startDate, currentDate, targetWeekdays);
  const percentage: number = (workingDays / totalDays) * 100;

  return {
    totalDays,
    workingDays,
    percentage: currentDay === payday ? 100 : percentage,
  };
}

function calculateWorkPercentageByHours(
  startTime: number,
  endTime: number,
): { totalMinutes: number; workedMinutes: number; percentage: number } {
  const current = new Date();
  const currentHour: number = current.getHours();
  const currentMinute: number = current.getMinutes();

  if (currentHour < startTime || currentHour >= endTime) {
    const totalMinutes = (endTime - startTime) * 60;
    return { totalMinutes, workedMinutes: totalMinutes, percentage: 100 };
  }

  const totalMinutes: number = (endTime - startTime) * 60;
  const workedMinutes: number = (currentHour - startTime) * 60 + currentMinute;

  const percentage: number = (workedMinutes / totalMinutes) * 100;

  return {
    totalMinutes,
    workedMinutes,
    percentage: percentage <= 100 ? percentage : 100,
  };
}

type MonthlyIncomType = {
  monthlyPercentage: number;
  currentMonthIncome: number;
};

export function useMonthlyInfo() {
  const [timerInfo, setTimerInfo] = useState<MonthlyIncomType>({
    currentMonthIncome: 0,
    monthlyPercentage: 0,
  });

  useEffect(() => {
    const value = LocalStorage.getItem('income');

    if (!value) {
      throw new Error('소득정보가 존재하지 않습니다.');
    }

    const { income, workday, payday } = JSON.parse(value);
    const { percentage: monthlyPercentage, totalDays, workingDays } = calculateWorkPercentageByPayday(payday, workday);
    const currentMonthIncome = +((income / totalDays) * workingDays).toFixed(0);

    setTimerInfo({
      monthlyPercentage: +monthlyPercentage.toFixed(1),
      currentMonthIncome,
    });
  }, []);

  return timerInfo;
}

type DailyIncomType = {
  dailyPercentage: number;
  currentIncome: number;
};

export function useDailyInfo() {
  const [timerInfo, setTimerInfo] = useState<DailyIncomType>({
    currentIncome: 0,
    dailyPercentage: 0,
  });

  useEffect(() => {
    const value = LocalStorage.getItem('income');

    if (!value) {
      throw new Error('소득정보가 존재하지 않습니다.');
    }

    const { income, workday, quitTime, startTime, payday } = JSON.parse(value);
    const { totalDays } = calculateWorkPercentageByPayday(payday, workday);

    const todayIncome = +(income / totalDays).toFixed(0);
    const {
      percentage: dailyPercentage,
      workedMinutes,
      totalMinutes,
    } = calculateWorkPercentageByHours(startTime, quitTime);
    const currentIncome = +((todayIncome / totalMinutes) * workedMinutes).toFixed(0);

    setTimerInfo({
      dailyPercentage: +dailyPercentage.toFixed(1),
      currentIncome,
    });
  }, []);

  return timerInfo;
}

export function useTimer() {
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, percentage: 100 });

  useEffect(() => {
    const value = LocalStorage.getItem('income');

    if (!value) {
      throw new Error('소득정보가 존재하지 않습니다.');
    }

    const { quitTime, startTime, workday }: Income = JSON.parse(value);
    const interval = setInterval(() => {
      const current = new Date();
      const currentHour: number = current.getHours();

      if (!isTodayWorkingDay(workday)) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, percentage: 100 });
        return;
      }

      if (currentHour < startTime || currentHour >= quitTime) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, percentage: 0 });
        return;
      }
      const remainingTime = set(new Date(), {
        hours: quitTime,
        minutes: 0,
        seconds: 0,
      });

      const { hours, minutes, seconds } = intervalToDuration({
        start: current,
        end: remainingTime,
      });

      const remainingHours = hours || 0;
      const remainingMinutes = minutes || 0;
      const remainingSeconds = seconds || 0;

      const percentage = (differenceInSeconds(remainingTime, current) / ((quitTime - startTime) * 3600)) * 100;
      setTimeLeft({
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds,
        percentage: +percentage.toFixed(0),
      });
    }, timer);
    setTimer(1000);
    return () => clearInterval(interval);
  }, [timer]);

  return timeLeft;
}
