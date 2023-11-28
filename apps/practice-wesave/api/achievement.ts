import { AxiosInstance } from 'axios';
import { AchivementResponse, Pagination, PaginationResponse } from '@/common';

import { instance } from './base';

export default class AchievementAPI {
  service: AxiosInstance;

  constructor(token: string) {
    this.service = instance.session;
    instance.setHeader({ header: 'Authorization', value: `Bearer ${token}` });
  }

  async getAchievements(options: Pagination): Promise<PaginationResponse<AchivementResponse>> {
    const result = await this.service.get<PaginationResponse<AchivementResponse>>(`/challenges/achievements`, {
      params: options,
    });
    return result.data;
  }

  async getMyAchievements(options: Pagination): Promise<PaginationResponse<AchivementResponse>> {
    const result = await this.service.get<PaginationResponse<AchivementResponse>>(`/challenges/my-achievements`, {
      params: options,
    });

    return result.data;
  }
}
