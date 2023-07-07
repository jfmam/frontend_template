// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const mock = {
  email: 'jfmam@naver.com',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (mock.email !== req.body.email) {
      return res.status(201).json({ message: '유저 생성을 완료하였습니다.' });
    }

    return res.status(422).json({
      message: '사용자 생성에 실패하였습니다.',
    });
  }
}
