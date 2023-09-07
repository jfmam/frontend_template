// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChallengeResponse } from '@/common';

export default function handler(req: NextApiRequest, res: NextApiResponse<ChallengeResponse[]>) {
  if (req.method === 'POST') return res.status(201);
}
