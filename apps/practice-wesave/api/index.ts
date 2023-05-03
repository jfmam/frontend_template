import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { singleton, container } from 'tsyringe';

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
    });
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.session.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
    return this.session.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
    return this.session.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
    return this.session.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.session.delete<T>(url, config);
  }
}

export const instance = container.resolve(APIService);
