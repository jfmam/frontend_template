import { format, getDay } from 'date-fns';

/**
 *
 * @returns param에 대한 월,일,요일을 반환
 */
export function useDateInfo(date: Date) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const month = format(date, 'M');
  const day = format(date, 'd');
  const dayOfWeek = getDay(date);
  const weekday = daysOfWeek[dayOfWeek];
  return {
    month,
    day,
    weekday,
  };
}
