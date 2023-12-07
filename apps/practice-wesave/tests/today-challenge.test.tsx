import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/msw/server';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import TodayChallenge from '@/pages/challenge/today-challenge';
import { TodayChallengeContainer } from '@/components/template';
import { mock } from '@/mocks/challenge-list';
import { rest } from 'msw';

mockIntersectionObserver();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('today-challenge page 테스트', () => {
  it('today chllenge list가 있을 경우', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TodayChallengeContainer token="token" />
      </QueryClientProvider>,
    );

    const challengeItems = await screen.findAllByRole('listitem');
    expect(challengeItems.length).toBe(Math.min(mock.length, 5));
  });

  it('challenge list가 없을 경우', async () => {
    server.use(
      rest.get('*', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            items: [],
            isLastPage: true,
          }),
        );
      }),
    );
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TodayChallenge token="token" />
      </QueryClientProvider>,
    );

    const component = await screen.findByRole('button', { name: '챌린지 만들기' });
    expect(component).toBeInTheDocument();
  });

  it('500 error', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');
    useRouter.mockImplementation(() => ({}));
    server.use(
      rest.get('*', (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <TodayChallenge token="" />
      </QueryClientProvider>,
    );
    const element = await screen.findByText(/네트워크 상태가 불안정합니다./);
    expect(element).toBeInTheDocument();
  });
});
