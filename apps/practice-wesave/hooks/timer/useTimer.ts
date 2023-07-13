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
    percentage: percentage <= 100 ? percentage : 100,
  };
}

function calculateWorkPercentageByHours(
  startTime: number,
  endTime: number,
): { totalMinutes: number; workedMinutes: number; percentage: number } {
  const currentHour: number = new Date().getHours();
  const currentMinute: number = new Date().getMinutes();

  if (currentHour < startTime || currentHour >= endTime) {
    return { totalMinutes: 0, workedMinutes: 0, percentage: 100 };
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
  currentMothIncome: string;
};

export function useMothlyInfo() {
  const [timerInfo, setTimerInfo] = useState<MonthlyIncomType>({
    currentMothIncome: '0',
    monthlyPercentage: 0,
  });

  useEffect(() => {
    const value = localStorage.getItem('income');

    if (!value) {
      throw new Error('소득정보가 존재하지 않습니다.');
    }

    const { income, workday, payday } = JSON.parse(value);
    const { percentage: monthlyPercentage, workingDays } = calculateWorkPercentageByPayday(payday, workday);
    const currentMothIncome = (income / workingDays).toFixed(0);

    setTimerInfo({
      monthlyPercentage: +monthlyPercentage.toFixed(1),
      currentMothIncome,
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
    const value = localStorage.getItem('income');

    if (!value) {
      throw new Error('소득정보가 존재하지 않습니다.');
    }

    const { income, workday, quitTime, startTime, payday } = JSON.parse(value);
    const { totalDays } = calculateWorkPercentageByPayday(payday, workday);

    const todayIncome = income / totalDays;
    const { percentage: dailyPercentage, workedMinutes } = calculateWorkPercentageByHours(startTime, quitTime);
    const currentIncome = todayIncome / workedMinutes;

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
    }, timer);
    setTimer(1000);
    return () => clearInterval(interval);
  }, [timer]);

  return timeLeft;
}
