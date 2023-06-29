import type { NextApiRequest, NextApiResponse } from 'next';
import { AchievementResponseMock } from '@/mocks/achievement';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);

    if ((offset - 1) * limit >= AchievementResponseMock.length) {
      return res.status(200).json({
        items: [],
        isLastPage: true,
      });
    }
    const result = AchievementResponseMock.slice((offset - 1) * limit, offset * limit);

    return res.status(200).json({
      items: result,
      isLastPage: false,
    });
  }
}
