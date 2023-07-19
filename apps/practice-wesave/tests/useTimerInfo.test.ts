import { useTimer } from '@/hooks/timer';
import LocalStorage from '@/utils/storage';
import { act, renderHook } from '@testing-library/react';

describe('Timer hook', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('일을 하지않는 요일', () => {
    jest.setSystemTime(new Date('2023-07-22T09:30:00'));
    const mockValue = JSON.stringify({ quitTime: 18, startTime: 9, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(0); // 1000ms(1초) 진행
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toStrictEqual({ hours: 0, minutes: 0, seconds: 0, percentage: 100 });
  });

  it('출근시간 전', () => {
    jest.setSystemTime(new Date('2023-07-19T08:30:00'));
    const mockValue = JSON.stringify({ quitTime: 18, startTime: 9, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(0); // 1000ms(1초) 진행
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toStrictEqual({ hours: 0, minutes: 0, seconds: 0, percentage: 0 });
  });

  it('퇴근시간 후', () => {
    jest.setSystemTime(new Date('2023-07-19T22:30:00'));
    const mockValue = JSON.stringify({ quitTime: 18, startTime: 9, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(0);
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toStrictEqual({ hours: 0, minutes: 0, seconds: 0, percentage: 0 });
  });

  it('출근시간', () => {
    jest.setSystemTime(new Date('2023-07-19T08:59:59'));
    const mockValue = JSON.stringify({ quitTime: 18, startTime: 9, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(0); // 타이머 실행
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toStrictEqual({ hours: 9, minutes: 0, seconds: 0, percentage: 100 });
  });

  it('퇴근시간', () => {
    jest.setSystemTime(new Date('2023-07-19T17:59:59'));
    const mockValue = JSON.stringify({ quitTime: 18, startTime: 9, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(0);
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toStrictEqual({ hours: 0, minutes: 0, seconds: 0, percentage: 0 });
  });

  it('업무 중', () => {
    jest.setSystemTime(new Date('2023-07-19T13:29:29'));
    const mockValue = JSON.stringify({ quitTime: 18, startTime: 9, workday: [1, 2, 3, 4, 5] });
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(mockValue);

    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(0); // 1000ms(1초) 진행
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toStrictEqual({ hours: 4, minutes: 30, seconds: 30, percentage: 50 });
  });
});
