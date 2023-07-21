import { useDailyInfo } from '@/hooks/timer';
import LocalStorage from '@/utils/storage';
import { renderHook } from '@testing-library/react';

describe('오늘 그래프 정보', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('퇴근 시간', () => {
    jest.setSystemTime(new Date('2023-07-21T18:00:00'));
    const mockValue = JSON.stringify({
      income: 2500000,
      payday: 10,
      startTime: 9,
      quitTime: 18,
      workday: [1, 2, 3, 4, 5],
    });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useDailyInfo());

    expect(result.current).toStrictEqual({ dailyPercentage: 100, currentIncome: 104167 });
  });

  it('출근 시간', () => {
    jest.setSystemTime(new Date('2023-07-21T09:00:00'));
    const mockValue = JSON.stringify({
      income: 2500000,
      payday: 10,
      startTime: 9,
      quitTime: 18,
      workday: [1, 2, 3, 4, 5],
    });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useDailyInfo());

    expect(result.current).toStrictEqual({
      dailyPercentage: 0,
      currentIncome: 0,
    });
  });

  it('진행 중', () => {
    jest.setSystemTime(new Date('2023-07-21T13:30:00'));
    const mockValue = JSON.stringify({
      income: 2500000,
      payday: 10,
      startTime: 9,
      quitTime: 18,
      workday: [1, 2, 3, 4, 5],
    });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useDailyInfo());

    expect(result.current).toStrictEqual({ dailyPercentage: 50, currentIncome: 52084 });
  });

  it('쉬는 날', () => {
    jest.setSystemTime(new Date('2023-07-26T09:00:00'));
    const mockValue = JSON.stringify({
      income: 2500000,
      payday: 10,
      startTime: 9,
      quitTime: 18,
      workday: [1, 2, 3, 4, 5],
    });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useDailyInfo());

    expect(result.current).toStrictEqual({ dailyPercentage: 0, currentIncome: 0 });
  });
});
