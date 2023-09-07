import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/msw/server';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import TodayChallenge from '@/pages/challenge/today-challenge';

mockIntersectionObserver();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('today-challenge page 테스트', () => {
  it('InfiniteScrolling 동작 확인', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TodayChallenge />
      </QueryClientProvider>,
    );

    const challengeItems = await screen.findAllByRole('listitem');
    expect(challengeItems.length).toBe(5);
  });

  it('challenge list가 없을 경우', () => {
    jest.mock('@/hooks/quries/challenge/useFetchChallenges', () => ({
      useFetchChallenges: jest.fn().mockImplementation(() => ({ data: { pages: [] } })),
    }));
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TodayChallenge />
      </QueryClientProvider>,
    );

    waitFor(() => expect(screen.findByRole('button', { name: '챌린지 만들기' })).toBeInTheDocument());
  });
});
