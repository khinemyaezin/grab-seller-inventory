import { useCallback } from "react";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";
import type { BinSearchCriteria } from "@/features/inventory/hooks/use-bin-filter";

const PAGE_SIZES = [5, 10, 20];
const ALL = "ALL";
const DEFAULT_SIZE = 20;

const FIELDS: FilterField[] = [
  {
    type: "input",
    name: "query",
    label: "Search",
    placeholder: "Search bins",
    debounceMs: 300,
  },
  {
    type: "select",
    name: "active",
    label: "Status",
    placeholder: "Status",
    groupLabel: "Bin Status",
    options: [
      { label: "All", value: ALL },
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
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
  size: String(DEFAULT_SIZE),
};

export type BinFilterProps = {
  onChange?: (filter: BinSearchCriteria) => void;
};

export default function BinFilter({ onChange }: BinFilterProps) {
  const handleChange = useCallback(
    (values: FilterValues) => {
      const query = typeof values.query === "string" ? values.query.trim() : "";
      const active = values.active === ALL ? undefined : values.active === "true";

      onChange?.({
        query: query || undefined,
        active,
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
      className="lg:grid-cols-[minmax(12rem,1fr)_minmax(9rem,12rem)_minmax(8rem,10rem)]"
    />
  );
}
