
import { useEffect } from "react";
import type { ReactNode } from "react";
import { FormProvider, useController, UseControllerProps, useForm, useWatch } from "react-hook-form";
import type { LocationSearchCriteria } from "@/features/inventory/hooks/use-location-filter";
import type { LocationType } from "@/features/inventory/types";
import { Field, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@khinemyaezin/seller-ui/components/select";

const PAGE_SIZES = [5, 10, 20];
const LOCATION_TYPES: LocationType[] = ["WAREHOUSE", "STORE"];

type FilterFormValue = {
    active: boolean | null;
    type: LocationType | null;
    size: number;
};

const DEFAULT_FILTER: FilterFormValue = {
    active: null,
    type: null,
    size: 20,
};

export type LocationsFilterProps = {
    onChange?: (filter: LocationSearchCriteria) => void;
};

export default function LocationsFilter({ onChange }: LocationsFilterProps) {
    const form = useForm<FilterFormValue>({
        mode: "onChange",
        defaultValues: DEFAULT_FILTER,
    });
    const { control, reset, trigger } = form;
    const watchedValues = useWatch({ control });
    const hasActiveFilters =
        (watchedValues.active !== null && watchedValues.active !== undefined) ||
        (watchedValues.type !== null && watchedValues.type !== undefined) ||
        Number(watchedValues.size ?? DEFAULT_FILTER.size) !== DEFAULT_FILTER.size;

    useEffect(() => {
        let isSubscribed = true;

        async function notifyChange() {
            const isValid = await trigger();

            if (isSubscribed && isValid) {
                onChange?.({
                    active: watchedValues.active ?? undefined,
                    type: watchedValues.type ?? undefined,
                    size: Number(watchedValues.size ?? DEFAULT_FILTER.size),
                });
            }
        }

        notifyChange();

        return () => {
            isSubscribed = false;
        };
    }, [onChange, trigger, watchedValues.active, watchedValues.type, watchedValues.size]);

    return (
        <FormProvider {...form}>
            <form
                className="flex w-full flex-col gap-3 rounded-md sm:flex-row sm:items-end sm:justify-between"
                onSubmit={(event) => event.preventDefault()}
            >
                <div className="grid w-full gap-3 sm:grid-cols-[minmax(9rem,12rem)_minmax(12rem,16rem)_minmax(8rem,10rem)]">
                    <FilterField label="Status" htmlFor="location-status-filter">
                        <ActiveSelect control={control} name="active" triggerId="location-status-filter" />
                    </FilterField>
                    <FilterField label="Type" htmlFor="location-type-filter">
                        <LocationTypeSelect
                            control={control}
                            name="type"
                            locationTypes={LOCATION_TYPES}
                            triggerId="location-type-filter"
                        />
                    </FilterField>
                    <FilterField label="Rows" htmlFor="location-size-filter">
                        <SizeSelect control={control} name="size" pageSizes={PAGE_SIZES} triggerId="location-size-filter" />
                    </FilterField>
                </div>
            </form>
        </FormProvider>
    );
}

function FilterField({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor: string;
    children: ReactNode;
}) {
    return (
        <Field className="gap-1.5">
            <FieldLabel htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">{label}</FieldLabel>
            {children}
        </Field>
    );
}

function SizeSelect({
    pageSizes,
    triggerId,
    ...controllerProps
}: UseControllerProps<FilterFormValue, "size"> & { pageSizes: number[]; triggerId: string }) {
    const { field } = useController(controllerProps);

    return (
        <Select
            value={String(field.value)}
            onValueChange={(value) => field.onChange(Number(value))}
        >
            <SelectTrigger id={triggerId} className="w-full">
                <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent align="start">
                <SelectGroup>
                    {pageSizes.map((item) => (
                        <SelectItem key={item} value={String(item)}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function ActiveSelect({
    triggerId,
    ...controllerProps
}: UseControllerProps<FilterFormValue, "active"> & { triggerId: string }) {
    const { field } = useController(controllerProps);

    return (
        <Select
            value={field.value === null ? "ALL" : String(field.value)}
            onValueChange={(value) => field.onChange(value === "ALL" ? null : value === "true")}
        >
            <SelectTrigger id={triggerId} className="w-full">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent align="start">
                <SelectGroup>
                    <SelectLabel>Location Status</SelectLabel>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function LocationTypeSelect({
    locationTypes,
    triggerId,
    ...controllerProps
}: UseControllerProps<FilterFormValue, "type"> & { locationTypes: LocationType[]; triggerId: string }) {
    const { field } = useController(controllerProps);

    return (
        <Select
            value={field.value ?? "ALL"}
            onValueChange={(value) => field.onChange(value === "ALL" ? null : value as LocationType)}
        >
            <SelectTrigger id={triggerId} className="w-full">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent align="start">
                <SelectGroup>
                    <SelectLabel>Location Type</SelectLabel>
                    <SelectItem value="ALL">All</SelectItem>
                    {locationTypes.map((item) => (
                        <SelectItem key={item} value={item}>
                            {formatLocationType(item)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function formatLocationType(type: LocationType) {
    return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
