export interface Pagination {
  offset: number;
  limit: number;
  lastKey?: string;
}

export type PaginationResponse<T> = {
  items: T[];
  isLastPage?: boolean;
  lastKey?: string;
  error?: { message: string; type?: 'network' | 'auth' | 'unknown' };
} & Pagination;
