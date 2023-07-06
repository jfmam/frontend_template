import { Token, UserLoginType } from '@/common/user';
import { AxiosInstance } from 'axios';
import { instance } from './base';

export default class UserAPI {
  service: AxiosInstance;

  constructor() {
    this.service = instance.session;
  }

  async login(params: UserLoginType): Promise<Token> {
    const result = await this.service.post<Token>('/user', params);

    if (result.status === 401) {
      throw new Error('잘못 된 아이디 또는 비밀번호 입니다.');
    }

    return { token: result.data.token };
  }
}
