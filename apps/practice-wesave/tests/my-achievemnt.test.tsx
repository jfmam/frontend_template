import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/msw/server';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import { MyAchievementContainer } from '@/components/template';
import { AchievementResponseMock } from '@/mocks/achievement';
import { rest } from 'msw';
import MyAchievement from '@/pages/challenge/my-achievement';

mockIntersectionObserver();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('my achievement page 테스트', () => {
  it('my achievement list가 있을 경우', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MyAchievementContainer token="token" />
      </QueryClientProvider>,
    );

    const myAchievementItems = await screen.findAllByRole('button');
    expect(myAchievementItems.length).toBe(AchievementResponseMock.length);
  });

  it('my achievement list가 없을 경우', async () => {
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
        <MyAchievementContainer token="token" />
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
        <MyAchievement token="" />
      </QueryClientProvider>,
    );
    const element = await screen.findByText(/네트워크 상태가 불안정합니다./);
    expect(element).toBeInTheDocument();
  });
});
