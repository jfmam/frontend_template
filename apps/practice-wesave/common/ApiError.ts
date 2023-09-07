type APIErrorType = 'network' | 'auth' | 'unknown';

export class APIError extends Error {
  constructor(message: string, cause: { type: APIErrorType; status: number }) {
    super(message, { cause: cause });
  }
}
