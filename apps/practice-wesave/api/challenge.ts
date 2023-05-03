import { ChallengeResponse } from '@/common/challenge';
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
}
