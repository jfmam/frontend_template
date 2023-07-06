// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const mock = {
  email: 'jfmam@naver.com',
  paaword: '123123',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (mock.email === req.body.email && mock.paaword === req.body.password) {
      const secretKey = process.env.SECRET_KEY as string;
      const token = jwt.sign(req.body.email, secretKey);
      return res.status(201).json({ token });
    }

    return res.status(401).json({
      message: '이메일 또는 패스워드가 일치하지 않습니다.',
    });
  }
}
