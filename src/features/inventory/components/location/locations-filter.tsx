
import { Pageable } from "@khinemyaezin/seller-api";
import { LocationsFilterForm } from "@/features/inventory/types";

export type LocationsFilterProps = {
    onChange?: (filter: LocationsFilterForm & Pageable) => void
}
export default function LocationsFilter({ }: LocationsFilterProps) {
    return (
        <></>
    );
}