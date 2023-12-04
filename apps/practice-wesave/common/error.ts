export function isInstanceOfAPIError(object: unknown): object is ApiError {
  return object instanceof ApiError && ('redirectUrl' in object || 'notFound' in object);
}

export class ApiError extends Error {
  redirectUrl: string = '';
  notFound: boolean = false;
}

export class NotFoundError extends ApiError {
  name = 'NotFoundError';
  message = '찾을 수 없습니다.';
  notFound = true;
  statusCode = 404;
}

export class AuthError extends ApiError {
  name = 'AuthError';
  message = '인증되지 않은 사용자입니다.';
  redirectUrl = '/login';
  statusCode = 401;
}

export class NetworkError extends ApiError {
  name = 'NetworkError';
  message = '네트워크 사용이 불가합니다. 관리자에게 문의 부탁드립니다.';
  redirectUrl = '/500';
  statusCode = 500;
}

export class UnknownError extends Error {
  name = 'unknownError';
  message = '네트워크 사용이 불가합니다. 관리자에게 문의 부탁드립니다.';
}
