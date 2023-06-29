export interface Pagination {
  offset: number;
  limit: number;
}

export type PaginationResponse<T> = {
  items: T[];
  isLastPage?: boolean;
} & Pagination;
