import { useCallback } from "react";
import type { LocationSearchCriteria } from "@/features/inventory/hooks/use-location-filter";
import type { LocationType } from "@/features/inventory/types";
import { Filter, type FilterField, type FilterValues } from "@khinemyaezin/seller-ui/components/filter";
import { SearchIcon } from "lucide-react";

const PAGE_SIZES = [5, 10, 20];
const LOCATION_TYPES: LocationType[] = ["WAREHOUSE", "STORE"];
const ALL = "ALL";
const DEFAULT_SIZE = 20;

const FIELDS: FilterField[] = [
    {
        type: "input",
        name: "query",
        label: "Search",
        placeholder: "Search",
        debounceMs: 300,
    },
    {
        type: "select",
        name: "active",
        label: "Status",
        placeholder: "Status",
        groupLabel: "Location Status",
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
        groupLabel: "Location Type",
        options: [
            { label: "All", value: ALL },
            ...LOCATION_TYPES.map((type) => ({ label: formatLocationType(type), value: type })),
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

export type LocationsFilterProps = {
    onChange?: (filter: LocationSearchCriteria) => void;
};

export default function LocationsFilter({ onChange }: LocationsFilterProps) {
    const handleChange = useCallback(
        (values: FilterValues) => {
            const query = typeof values.query === "string" ? values.query.trim() : "";
            const active = values.active === ALL ? undefined : values.active === "true";
            const type = values.type === ALL ? undefined : (values.type as LocationType);

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
            className="flex"
        />
    );
}

function formatLocationType(type: LocationType) {
    return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
