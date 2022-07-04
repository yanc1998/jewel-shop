/**
 * Generic paginatedFind payload with pagination included.
 *
 * @export
 * @type PaginatedFindResult
 * @template T
 */
export type PaginatedFindResult<T> = {
  items: T[];
  limit: number;
  currentPage: number;
  totalPages: number;
};

export const getDefaultPaginatedFindResult = <T>(): PaginatedFindResult<T> => {
  return {
    items: [],
    limit: 0,
    currentPage: 0,
    totalPages: 0,
  };
};
