import { useCallback } from "react";
import type { ItemSearchCriteria } from "@/features/inventory/hooks/use-item-filter";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";

const PAGE_SIZES = [5, 10, 20];
const DEFAULT_SIZE = 5;

export type ItemsFilterProps = {
  onChange?: (filter: ItemSearchCriteria) => void;
};

export default function ItemsFilter({ onChange }: ItemsFilterProps) {
  const fields: FilterField[] = [
    {
      type: "input",
      name: "sku",
      label: "",
      placeholder: "Search by SKU",
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

  const handleChange = useCallback(
    (values: FilterValues) => {
      const sku = typeof values.sku === "string" ? values.sku.trim() : "";

      onChange?.({
        sku: sku || undefined,
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
        size: String(DEFAULT_SIZE),
      }}
      onChange={handleChange}
      className="flex flex-wrap gap-3"
    />
  );
}
