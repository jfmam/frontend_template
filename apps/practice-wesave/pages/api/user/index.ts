// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const mock = {
  id: 1,
  email: 'jfmam@naver.com',
  paaword: '123123',
  name: 'hello',
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

  if (req.method === 'DELETE') {
    if (mock.id === Number(req.query.id)) {
      return res.status(201).json({
        message: '회원탈퇴를 완료 하였습니다.',
      });
    }

    return res.status(404).json({
      message: '존재하지 않는 유저입니다.',
    });
  }
}
