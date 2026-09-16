import { useCallback, useState } from "react";
import type { Pageable } from "@khinemyaezin/seller-api";
import type { LocationsFilterForm } from "@/features/inventory/types";

export type LocationFilterFormValue = LocationsFilterForm & Pageable;

const DEFAULT_FILTER: LocationFilterFormValue = {
  page: 0,
  size: 20,
};

export type LocationSearchCriteria = LocationsFilterForm & Pick<LocationFilterFormValue, "size">;

export function useLocationFilter(initial?: Partial<LocationFilterFormValue>) {
  const [filter, setFilter] = useState<LocationFilterFormValue>({ ...DEFAULT_FILTER, ...initial });

  const updateCriteria = useCallback((criteria: LocationSearchCriteria) => {
    setFilter((prev) => ({ ...prev, ...criteria, page: 0 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  return { filter, updateCriteria, updatePage } as const;
}
