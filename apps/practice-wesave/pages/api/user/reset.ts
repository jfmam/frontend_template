// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const mock = {
  password: 'password123',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (mock.password === req.body.password) {
      return res.status(400).json({
        message: '이전과 다른 비밀번호를 생성해 주세요.',
      });
    }
    return res.status(201).json({ message: '비밀번호 재설정을 완료하였습니다.' });
  }
}
