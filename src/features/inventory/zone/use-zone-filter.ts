import { useCallback, useState } from "react";
import type { Pageable } from "@khinemyaezin/seller-api";
import type { ZonesFilterForm } from "@/features/inventory/types";

export type ZoneFilterFormValue = ZonesFilterForm & Pageable;

const DEFAULT_FILTER: ZoneFilterFormValue = {
  page: 0,
  size: 20,
};

export type ZoneSearchCriteria = ZonesFilterForm & Pick<ZoneFilterFormValue, "size">;

export function useZoneFilter(initial?: Partial<ZoneFilterFormValue>) {
  const [filter, setFilter] = useState<ZoneFilterFormValue>({ ...DEFAULT_FILTER, ...initial });

  const updateCriteria = useCallback((criteria: ZoneSearchCriteria) => {
    setFilter((prev) => ({ ...prev, ...criteria, page: 0 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  return { filter, updateCriteria, updatePage } as const;
}
