export function isTodayWorkingDay(targetWorkingDays: string[]): boolean {
  const weekdays: string[] = ['일', '월', '화', '수', '목', '금', '토'];
  const today: string = weekdays[new Date().getDay()];

  return targetWorkingDays.includes(today);
}
