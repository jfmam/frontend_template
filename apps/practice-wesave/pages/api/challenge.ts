// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChallengeResponse } from '@/common/challenge';
import { challengeResponseMock } from '@/mocks/challenge-list';

export default function handler(req: NextApiRequest, res: NextApiResponse<ChallengeResponse[]>) {
  if (req.method === 'GET') return res.status(200).json(challengeResponseMock);
  if (req.method === 'POST') return res.status(201).json(req.body);
}
