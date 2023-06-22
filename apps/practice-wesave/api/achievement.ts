import { AchivementResponse } from '@/common/achievement';

import { AxiosInstance } from 'axios';
import { instance } from './base';

export default class AchievementAPI {
  service: AxiosInstance;

  constructor() {
    this.service = instance.session;
  }

  async getAchievements(): Promise<AchivementResponse[]> {
    const result = await this.service.get<AchivementResponse[]>('/achievement');

    return result.data;
  }
}
