
import { HateoasLink } from "@khinemyaezin/seller-api";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import LocationTable from "./location-table";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Link } from "react-router";
import { routes } from "@khinemyaezin/seller-contracts";
import { useState } from "react";
import { Pageable } from "@khinemyaezin/seller-api";
import LocationsFilter from "./locations-filter";
import { LocationsFilterForm } from "@/features/inventory/types/inventory.form";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { LocationLifecycleEvent } from "@/types";

export type LocationsViewProps = {
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
}
export default function LocationsView({ onLifecycleEvent }: LocationsViewProps) {
    const createLocationLink = useInventoryLink("createLocation");
    const [filter, setFilter] = useState<LocationsFilterForm & Pageable>({ page: 0, size: 20 });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Location list</CardTitle>
                <CardAction>
                    {createLocationLink && (
                        <Button variant='outline' asChild>
                            <Link to="new">
                                Add location
                            </Link>
                        </Button>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <LocationsFilter
                    onChange={(value) => setFilter(value)} >
                </LocationsFilter>

                <LocationTable
                    filter={filter}
                    onPageChange={(page) => {

                    }}
                    onLifecycleEvent={onLifecycleEvent}
                ></LocationTable>
            </CardContent>
        </Card>
    );
}