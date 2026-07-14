import { useCallback, useState } from "react";
import type { Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm } from "@/features/inventory/types";

export type BinFilterFormValue = BinsFilterForm & Pageable;

const DEFAULT_FILTER: BinFilterFormValue = {
  page: 0,
  size: 20,
};

export type BinSearchCriteria = BinsFilterForm & Pick<BinFilterFormValue, "size">;

export function useBinFilter(initial?: Partial<BinFilterFormValue>) {
  const [filter, setFilter] = useState<BinFilterFormValue>({ ...DEFAULT_FILTER, ...initial });

  const updateCriteria = useCallback((criteria: BinSearchCriteria) => {
    setFilter((prev) => ({ ...prev, ...criteria, page: 0 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  return { filter, updateCriteria, updatePage } as const;
}
