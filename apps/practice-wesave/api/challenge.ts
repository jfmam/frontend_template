import { ChallengeResponse, Challenge } from '@/common/challenge';
import { AxiosInstance } from 'axios';
import { instance } from './base';

export default class ChallengeAPI {
  service: AxiosInstance;

  constructor() {
    this.service = instance.session;
  }

  async getChallenges(): Promise<ChallengeResponse[]> {
    const result = await this.service.get<ChallengeResponse[]>('/challenge');

    return result.data;
  }

  async createChallenges(challenge: Challenge): Promise<{ status: number; message: 'success' | 'error' }> {
    const result = await this.service.post('/challenge', challenge);

    return result.status === 201 ? { status: 201, message: 'success' } : { status: result.status, message: 'error' };
  }

  async toggleChallenges(
    challengeId: ChallengeResponse['id'],
  ): Promise<{ status: number; message: 'success' | 'error' }> {
    const result = await this.service.post(`/challenge/${challengeId}`);

    return result.status === 201 ? { status: 201, message: 'success' } : { status: result.status, message: 'error' };
  }
}
