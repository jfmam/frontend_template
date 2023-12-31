import { AxiosResponse } from 'axios';

export interface Response {
  id: number;
}

export type AxiosReponseType<T> = AxiosResponse<T, any>;
