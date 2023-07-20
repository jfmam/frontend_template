import { useMonthlyInfo } from '@/hooks/timer';
import LocalStorage from '@/utils/storage';
import { renderHook } from '@testing-library/react';

describe('한달 그래프 정보', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('월급 당일', () => {
    jest.setSystemTime(new Date('2023-07-10T09:00:00'));
    const mockValue = JSON.stringify({ income: 2500000, payday: 10, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useMonthlyInfo());

    expect(result.current).toStrictEqual({ monthlyPercentage: 100, currentMonthIncome: 2500000 });
  });

  it('payday보다 날짜가 이전일 때', () => {
    jest.setSystemTime(new Date('2023-08-09T09:00:00'));
    const mockValue = JSON.stringify({ income: 2500000, payday: 10, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useMonthlyInfo());

    expect(result.current).toStrictEqual({
      monthlyPercentage: 95.8,
      currentMonthIncome: 2395833,
    });
  });

  it('payday보다 날짜가 이후일 때', () => {
    jest.setSystemTime(new Date('2023-07-25T09:00:00'));
    const mockValue = JSON.stringify({ income: 2500000, payday: 10, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useMonthlyInfo());

    expect(result.current).toStrictEqual({ monthlyPercentage: 50, currentMonthIncome: 1250000 });
  });
});
