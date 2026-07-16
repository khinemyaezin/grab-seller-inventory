import { useCallback, useMemo } from "react";
import type { ItemSearchCriteria } from "@/features/inventory/hooks/use-item-filter";
import type { InventoryStatus } from "@/features/inventory/types";
import { INVENTORY_STATUSES } from "@/features/inventory/types";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";

const PAGE_SIZES = [5, 10, 20];
const ALL = "ALL";
const DEFAULT_SIZE = 20;

export type ItemsFilterProps = {
  onChange?: (filter: ItemSearchCriteria) => void;
};

export default function ItemsFilter({ onChange }: ItemsFilterProps) {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, { page: 0, size: 100, active: true });
  const locations = locationsData?._embedded?.locationResponseList ?? [];

  const fields: FilterField[] = useMemo(
    () => [
      {
        type: "input",
        name: "sku",
        label: "",
        placeholder: "Search by SKU",
        debounceMs: 300,
      }
    ],
    [locations],
  );

  const handleChange = useCallback(
    (values: FilterValues) => {
      const sku = typeof values.sku === "string" ? values.sku.trim() : "";
      const locationId = values.locationId === ALL ? undefined : (values.locationId as string | undefined);
      const status = values.status === ALL ? undefined : (values.status as InventoryStatus | undefined);

      onChange?.({
        sku: sku || undefined,
        locationId: locationId || undefined,
        status,
        size: Number(values.size ?? DEFAULT_SIZE),
      });
    },
    [onChange],
  );

  return (
    <Filter
      fields={fields}
      defaultValues={{
        sku: "",
        locationId: ALL,
        status: ALL,
        size: String(DEFAULT_SIZE),
      }}
      onChange={handleChange}
      className="flex"
    />
  );
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
