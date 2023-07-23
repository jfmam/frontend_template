// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { mock as challengeResponseMock } from '@/mocks/challenge-list';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);

    if ((offset - 1) * limit >= challengeResponseMock.length) {
      return res.status(200).json({
        items: [],
        isLastPage: true,
      });
    }
    const result = challengeResponseMock.slice((offset - 1) * limit, offset * limit);

    return res.status(200).json({
      items: result,
      isLastPage: false,
    });
  }
  if (req.method === 'POST') return res.status(201).json(req.body);
}
