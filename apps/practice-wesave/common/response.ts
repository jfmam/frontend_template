import { AxiosResponse } from 'axios';

export interface Response {
  id: number;
  createDate: string;
  updateDate: string;
}

export type AxiosReponseType<T> = AxiosResponse<T, any>;
