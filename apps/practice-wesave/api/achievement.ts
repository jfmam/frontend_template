import { AchivementResponse } from '@/common/achievement';
import { Pagination, PaginationResponse } from '@/common/pagination';

import { AxiosInstance } from 'axios';
import { instance } from './base';

export default class AchievementAPI {
  service: AxiosInstance;

  constructor() {
    this.service = instance.session;
  }

  async getAchievements(options: Pagination): Promise<PaginationResponse<AchivementResponse>> {
    const result = await this.service.get<PaginationResponse<AchivementResponse>>(`/achievement`, {
      params: options,
    });

    return result.data;
  }
}
