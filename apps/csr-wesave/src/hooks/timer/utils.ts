import { getDay } from 'date-fns';

export function isTodayWorkingDay(workingDays: number[]): boolean {
  const today = getDay(new Date());

  return workingDays.includes(today);
}
