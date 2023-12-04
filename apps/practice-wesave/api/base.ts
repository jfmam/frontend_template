import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { singleton, container } from 'tsyringe';
import { AuthError, NotFoundError } from '@/common/error';

export interface RequestConfig extends AxiosRequestConfig {
  suppressStatusCode?: number[];
}

function AxiosAuthInterceptor<T>(response: AxiosResponse<T>): AxiosResponse {
  const status = response.status;

  if (status === 404) {
    throw new NotFoundError();
  }

  if (status === 401) {
    throw new AuthError();
  }

  return response;
}
@singleton()
class APIService {
  public session: AxiosInstance;

  constructor() {
    const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL;
    const host = process.env.NEXT_PUBLIC_API_DOMAIN;

    this.session = axios.create({
      baseURL: `${protocol}://${host}/api`,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      validateStatus: status => status < 500,
      timeout: 5000,
    });

    this.session.interceptors.response.use(response => AxiosAuthInterceptor(response));
  }

  setHeader({ header, value }: { header: string; value: string }) {
    this.session.defaults.headers.common[header] = value;
  }
}

export const instance = container.resolve(APIService);
