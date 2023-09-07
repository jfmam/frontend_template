import { APIError } from '@/common';

export const checkError = (status: number) => {
  try {
    if (status === 401) {
      throw new APIError('권한이 없습니다.', { status: 401, type: 'auth' });
    }

    if (status === 500) {
      throw new Error('네트워크 오류입니다.');
    }

    if (status.toString().includes('5')) {
      throw new APIError('네트워크 오류입니다.', { status: status, type: 'unknown' });
    }
  } catch (e) {
    throw e;
  }
};
