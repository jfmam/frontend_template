import { rest } from 'msw';

import { mock as challengeMocks } from '../challenge-list';
import { AchievementMock as achievementMock, AchievementResponseMock as myAchievementMock } from '../achievement';

export const handlers = [
  rest.get('http://localhost:3000/api/challenge', (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    if ((offset - 1) * limit >= challengeMocks.length) {
      return res(
        ctx.status(200),
        ctx.json({
          items: [],
          isLastPage: true,
        }),
      );
    }
    const result = challengeMocks.slice((offset - 1) * limit, offset * limit);
    return res(
      ctx.status(200),
      ctx.json({
        items: result,
        isLastPage: false,
      }),
    );
  }),

  rest.get('http://localhost:3000/api/achievement', (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    if ((offset - 1) * limit >= achievementMock.length) {
      return res(
        ctx.status(200),
        ctx.json({
          items: [],
          isLastPage: true,
        }),
      );
    }
    const result = achievementMock.slice((offset - 1) * limit, offset * limit);
    return res(
      ctx.status(200),
      ctx.json({
        items: result,
        isLastPage: false,
      }),
    );
  }),
  rest.get('http://localhost:3000/api/my-achievement', (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    if ((offset - 1) * limit >= myAchievementMock.length) {
      return res(
        ctx.status(200),
        ctx.json({
          items: [],
          isLastPage: true,
        }),
      );
    }
    const result = myAchievementMock.slice((offset - 1) * limit, offset * limit);
    return res(
      ctx.status(200),
      ctx.json({
        items: result,
        isLastPage: false,
      }),
    );
  }),
];
