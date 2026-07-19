import { useCallback } from "react";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";
import type { ZoneSearchCriteria } from "@/features/inventory/hooks/use-zone-filter";
import type { ZoneType } from "@/features/inventory/types";

const PAGE_SIZES = [5, 10, 20];
const DEFAULT_SIZE = 5;

const FIELDS: FilterField[] = [
  {
    type: "input",
    name: "query",
    label: "",
    placeholder: "Search zones",
    debounceMs: 300,
  },
  {
    type: "select",
    name: "size",
    label: "",
    placeholder: "Page size",
    options: PAGE_SIZES.map((size) => ({ label: String(size), value: String(size) })),
  },
];

const DEFAULT_VALUES: FilterValues = {
  query: "",
  size: String(DEFAULT_SIZE),
};

export type ZoneFilterProps = {
  onChange?: (filter: ZoneSearchCriteria) => void;
};

export default function ZoneFilter({ onChange }: ZoneFilterProps) {
  const handleChange = useCallback(
    (values: FilterValues) => {
      const query = typeof values.query === "string" ? values.query.trim() : "";

      onChange?.({
        query: query || undefined,
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
      className="flex flex-wrap gap-3"
    />
  );
}

function formatZoneType(type: ZoneType) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
