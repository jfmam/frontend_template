import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/msw/server';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import MyAchievement from '@/pages/challenge/my-achievement';
import userEvent from '@testing-library/user-event';

mockIntersectionObserver();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('my achievement page 테스트', () => {
  it('InfiniteScrolling 동작 확인', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MyAchievement />
      </QueryClientProvider>,
    );

    const myAchievementItems = await screen.findAllByRole('button');
    waitFor(() => expect(myAchievementItems.length).toBe(2));
  });

  it('my achievement list가 없을 경우', () => {
    jest.mock('@/hooks/quries/challenge/useFetchMyAchievement', () => ({
      useFetchMyAchievements: jest.fn().mockImplementation(() => ({ data: { pages: [] } })),
    }));
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MyAchievement />
      </QueryClientProvider>,
    );

    waitFor(() => expect(screen.findByRole('button', { name: '챌린지 만들기' })).toBeInTheDocument());
  });

  it('my achievement 상세보기', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MyAchievement />
      </QueryClientProvider>,
    );
    const myAchievementItems = await screen.findAllByRole('img');
    userEvent.click(myAchievementItems[0]);
    waitFor(() => expect(screen.findByRole('dialog')).toBeInTheDocument());
  });
});
