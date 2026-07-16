import { useCallback, useState } from "react";
import type { Pageable } from "@khinemyaezin/seller-api";
import type { ItemsFilterForm } from "@/features/inventory/types";

export type ItemFilterFormValue = ItemsFilterForm & Pageable;

const DEFAULT_FILTER: ItemFilterFormValue = {
  page: 0,
  size: 20,
};

export type ItemSearchCriteria = ItemsFilterForm & Pick<ItemFilterFormValue, "size">;

export function useItemFilter(initial?: Partial<ItemFilterFormValue>) {
  const [filter, setFilter] = useState<ItemFilterFormValue>({ ...DEFAULT_FILTER, ...initial });

  const updateCriteria = useCallback((criteria: ItemSearchCriteria) => {
    setFilter((prev) => ({ ...prev, ...criteria, page: 0 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  return { filter, updateCriteria, updatePage } as const;
}
