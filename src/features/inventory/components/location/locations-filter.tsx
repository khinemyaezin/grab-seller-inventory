import { useCallback } from "react";
import type { LocationSearchCriteria } from "@/features/inventory/hooks/use-location-filter";
import type { LocationType } from "@/features/inventory/types";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";

const PAGE_SIZES = [5, 10, 20];
const ALL = "ALL";
const DEFAULT_SIZE = 20;

const FIELDS: FilterField[] = [
    {
        type: "input",
        name: "query",
        label: "",
        placeholder: "Search",
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

export type LocationsFilterProps = {
    onChange?: (filter: LocationSearchCriteria) => void;
};

export default function LocationsFilter({ onChange }: LocationsFilterProps) {
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


