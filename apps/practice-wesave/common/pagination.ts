export interface Pagination {
  offset: number;
  limit: number;
}

export type PaginationResponse<T> = {
  items: T[];
  isLastPage?: boolean;
  error?: { message: string; type?: 'network' | 'auth' | 'unknown' };
} & Pagination;
