import { Cookies } from 'react-cookie';

const cookies = new Cookies();

type CookieSetOptions = {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
  encode?: (value: string) => string;
};

export const setAccessToken = (accessToken: string, options?: CookieSetOptions) => {
  if (cookies.get('token')) {
    cookies.remove('token');
  }

  return cookies.set('token', accessToken, {
    ...options,
    path: '/',
    maxAge: 900,
  });
};

export const getAccessToken = () => {
  return cookies.get('token');
};

export const setRefreshToken = (refreshToken: string, options?: CookieSetOptions) => {
  return cookies.set('refreshToken', refreshToken, options);
};

export const getRefreshToken = () => {
  return cookies.get('refreshToken');
};

class LocalStorage {
  constructor() {}

  static setItem(key: string, item: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, item);
    }
  }

  static getItem(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  static removeItem(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}

export default LocalStorage;
