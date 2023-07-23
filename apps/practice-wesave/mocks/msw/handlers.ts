import { rest } from 'msw';

import { mock as ChallengeMocks } from '../challenge-list';

export const handlers = [
  rest.get('http://localhost:3000/api/challenge', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(ChallengeMocks));
  }),
];
