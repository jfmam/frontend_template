// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const mock = {
  email: 'jfmam@naver.com',
  paaword: '123123',
  name: 'hello',
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

  if (req.method === 'GET') {
    if (mock.email === req.query.email) {
      return res.status(200).json({
        email: mock.email,
        name: mock.name,
      });
    }

    return res.status(404).json({
      message: '존재하지 않는 유저입니다.',
    });
  }
}
