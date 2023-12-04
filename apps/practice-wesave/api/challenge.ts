import { AxiosInstance } from 'axios';
import { ChallengeResponse, Challenge, Pagination, PaginationResponse } from '@/common';

import { instance } from './base';

export default class ChallengeAPI {
  service: AxiosInstance;

  constructor(token?: string) {
    this.service = instance.session;

    instance.setHeader({ header: 'Authorization', value: `Bearer ${token}` });
  }

  async getChallenges(options: Pagination): Promise<PaginationResponse<ChallengeResponse>> {
    const result = await this.service.get<PaginationResponse<ChallengeResponse>>('/challenges', {
      params: options,
    });

    return result.data;
  }

  async createChallenges(challenge: Challenge): Promise<{ status: number; message: 'success' | 'error' }> {
    const result = await this.service.post('/challenges', challenge);

    return result.status === 201 ? { status: 201, message: 'success' } : { status: result.status, message: 'error' };
  }

  async toggleChallenges(
    challengeId: ChallengeResponse['id'],
  ): Promise<{ status: number; message: 'success' | 'error' }> {
    const result = await this.service.post(`/challenges/${challengeId}`);

    return result.status === 201 ? { status: 201, message: 'success' } : { status: result.status, message: 'error' };
  }
}
