import { useCallback } from "react";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";
import type { ZoneSearchCriteria } from "@/features/inventory/hooks/use-zone-filter";
import type { ZoneType } from "@/features/inventory/types";
import { ZONE_TYPES } from "@/features/inventory/types/inventory.model";

const PAGE_SIZES = [5, 10, 20];
const ALL = "ALL";
const DEFAULT_SIZE = 20;

const FIELDS: FilterField[] = [
  {
    type: "input",
    name: "query",
    label: "Search",
    placeholder: "Search zones",
    debounceMs: 300,
  },
  {
    type: "select",
    name: "active",
    label: "Status",
    placeholder: "Status",
    groupLabel: "Zone Status",
    options: [
      { label: "All", value: ALL },
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  {
    type: "select",
    name: "type",
    label: "Type",
    placeholder: "Type",
    groupLabel: "Zone Type",
    options: [
      { label: "All", value: ALL },
      ...ZONE_TYPES.map((type) => ({ label: formatZoneType(type), value: type })),
    ],
  },
  {
    type: "select",
    name: "size",
    label: "Rows",
    placeholder: "Page size",
    options: PAGE_SIZES.map((size) => ({ label: String(size), value: String(size) })),
  },
];

const DEFAULT_VALUES: FilterValues = {
  query: "",
  active: ALL,
  type: ALL,
  size: String(DEFAULT_SIZE),
};

export type ZoneFilterProps = {
  onChange?: (filter: ZoneSearchCriteria) => void;
};

export default function ZoneFilter({ onChange }: ZoneFilterProps) {
  const handleChange = useCallback(
    (values: FilterValues) => {
      const query = typeof values.query === "string" ? values.query.trim() : "";
      const active = values.active === ALL ? undefined : values.active === "true";
      const type = values.type === ALL ? undefined : (values.type as ZoneType);

      onChange?.({
        query: query || undefined,
        active,
        type,
        size: Number(values.size ?? DEFAULT_SIZE),
      });
    },
    [onChange]
  );

  return (
    <Filter
      fields={FIELDS}
      defaultValues={DEFAULT_VALUES}
      onChange={handleChange}
      className="lg:grid-cols-[minmax(14rem,1fr)_minmax(9rem,12rem)_minmax(12rem,16rem)_minmax(8rem,10rem)]"
    />
  );
}

function formatZoneType(type: ZoneType) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
