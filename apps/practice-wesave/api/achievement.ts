import { AxiosInstance } from 'axios';
import { AchivementResponse, Pagination, PaginationResponse } from '@/common';

import { instance } from './base';
import { checkError } from './error';

export default class AchievementAPI {
  service: AxiosInstance;

  constructor() {
    this.service = instance.session;
  }

  async getAchievements(options: Pagination): Promise<PaginationResponse<AchivementResponse>> {
    const result = await this.service.get<PaginationResponse<AchivementResponse>>(`/achievement`, {
      params: options,
    });
    checkError(result.status);
    return result.data;
  }

  async getMyAchievements(options: Pagination): Promise<PaginationResponse<AchivementResponse>> {
    const result = await this.service.get<PaginationResponse<AchivementResponse>>(`/my-achievement`, {
      params: options,
    });

    return result.data;
  }
}
