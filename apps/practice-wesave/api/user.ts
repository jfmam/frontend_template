import { AxiosInstance } from 'axios';
import { AuthError, SignUpType, Token, UserLoginType, UserResponse } from '@/common';

import { instance } from './base';

export default class UserAPI {
  service: AxiosInstance;

  constructor(token?: string) {
    this.service = instance.session;

    if (token) instance.setHeader({ header: 'Authorization', value: `Bearer ${token}` });
  }

  async login(params: UserLoginType): Promise<Token> {
    const result = await this.service.post<Token>('/users/login', params);

    if (result.status === 401 || !result.data.token) {
      throw new AuthError();
    }

    instance.setHeader({ header: 'Authorization', value: `Bearer ${result.data.token}` });
    return { token: result.data.token };
  }

  async creaetUser({ email, name, password }: SignUpType): Promise<{ message: string }> {
    const result = await this.service.post('/users', {
      email,
      name,
      password,
    });

    if (result.status === 422) {
      throw new Error('이미 존재하는 유저입니다.');
    }

    return { message: '새로운 유저를 생성 하였습니다.' };
  }

  async findUserByEmail(email: string): Promise<UserResponse> {
    const result = await this.service.get('/users', { params: { email } });

    if (result.status === 404) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    return result.data;
  }

  async getUser(): Promise<UserResponse> {
    const result = await this.service.get('users/profile');

    return result.data;
  }

  async resetPassword(password: string): Promise<{ message: string }> {
    const result = await this.service.post('/user/reset', { password });

    if (result.status === 400) {
      throw new Error('이전과 같은 비밀번호 입니다.');
    }

    return { message: '비밀번호를 재설정 하였습니다.' };
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const result = await this.service.delete('/user', {
      params: { id: userId },
    });

    if (result.status === 404) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    return { message: '서비스 탈퇴를 완료 하였습니다.' };
  }
}
