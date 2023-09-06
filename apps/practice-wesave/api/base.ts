import axios, { AxiosInstance } from 'axios';
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
      validateStatus: () => true,
      timeout: 5000,
    });
  }
}

export const instance = container.resolve(APIService);
