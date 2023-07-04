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
  return cookies.set('accessToken', accessToken, options);
};

export const getAccessToken = () => {
  return cookies.get('accessToken');
};

export const setRefreshToken = (refreshToken: string, options?: CookieSetOptions) => {
  return cookies.set('refreshToken', refreshToken, options);
};

export const getRefreshToken = () => {
  return cookies.get('refreshToken');
};

export const getLocalStorageItem = <T>(key: string) => {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  const result: T = JSON.parse(data);
  return result;
};

export const setLocalStorageItem = (key: string, data: any) => {
  const value = JSON.stringify(data);
  return localStorage.setItem(key, value);
};

export const removeLocalStorageItem = (key: string) => {
  return localStorage.removeItem(key);
};
