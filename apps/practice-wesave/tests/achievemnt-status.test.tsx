import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/msw/server';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import AchievementStatus from '@/pages/challenge/achievement-status';
import userEvent from '@testing-library/user-event';

mockIntersectionObserver();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('achievement page 테스트', () => {
  it('InfiniteScrolling 동작 확인', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AchievementStatus />
      </QueryClientProvider>,
    );

    const achievementItems = await screen.findAllByRole('listitem');
    expect(achievementItems.length).toBe(2);
  });

  it('achievement list가 없을 경우', () => {
    jest.mock('@/hooks/quries/challenge/useFetchAchievements', () => ({
      useFetchAchievements: jest.fn().mockImplementation(() => ({ data: { pages: [] } })),
    }));
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AchievementStatus />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('button', { name: '챌린지 만들기' })).toBeInTheDocument();
  });

  it('achivement 상세보기', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AchievementStatus />
      </QueryClientProvider>,
    );
    const achievementItems = await screen.findAllByRole('listitem');
    userEvent.click(achievementItems[0]);
    waitFor(() => expect(screen.findByRole('dialog')).toBeInTheDocument());
  });
});
