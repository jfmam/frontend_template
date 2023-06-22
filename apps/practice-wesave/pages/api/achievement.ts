import type { NextApiRequest, NextApiResponse } from 'next';
import { AchievementResponseMock } from '@/mocks/achievement';
import { AchivementResponse } from '@/common/achievement';

export default function handler(req: NextApiRequest, res: NextApiResponse<AchivementResponse[]>) {
  if (req.method === 'GET') return res.status(200).json(AchievementResponseMock);
}
