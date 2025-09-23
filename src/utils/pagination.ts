export interface IPage<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function paginate<T>(items: T[], page: number = 1, pageSize: number = 10, count?: number): IPage<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  const totalItems = count ?? items.length;
  const totalPages = Math.ceil(totalItems / safePageSize);

  const startIndex = (safePage - 1) * safePageSize;
  const endIndex = startIndex + safePageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
  };
}