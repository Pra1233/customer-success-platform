import { useCallback, useMemo, useState } from "react";

interface UsePaginationOptions {
  initialLimit?: number;
}

interface UsePaginationReturn {
  offset: number;
  limit: number;
  page: number;
  goToPage: (targetPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination({
  initialLimit = 20,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(initialLimit);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const goToPage = useCallback(
    (targetPage: number) => {
      setOffset(Math.max(0, (targetPage - 1) * limit));
    },
    [limit]
  );

  const nextPage = useCallback(() => setOffset((prev) => prev + limit), [limit]);
  const prevPage = useCallback(
    () => setOffset((prev) => Math.max(0, prev - limit)),
    [limit]
  );
  const reset = useCallback(() => setOffset(0), []);

  return { offset, limit, page, goToPage, nextPage, prevPage, reset };
}
