import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AchievementContainer from '@/components/template/container/AchievementContainer';
import { AchievementResponseMock } from '@/mocks/achievement';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import { server } from '@/mocks/msw/server';
import { rest } from 'msw';
import AchievementStatus from '@/pages/challenge/achievement-status';

mockIntersectionObserver();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('achievement page 테스트', () => {
  it('achievement list가 있을 경우', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AchievementContainer token={'test'} />
      </QueryClientProvider>,
    );

    const achievementItems = await screen.findAllByRole('listitem');
    expect(achievementItems.length).toBe(AchievementResponseMock.length);
  });

  it('achievement list가 없을 경우', async () => {
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

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <AchievementContainer token={'test'} />
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
        <AchievementStatus token="" />
      </QueryClientProvider>,
    );
    const element = await screen.findByText(/네트워크 상태가 불안정합니다./);
    expect(element).toBeInTheDocument();
  });
});
