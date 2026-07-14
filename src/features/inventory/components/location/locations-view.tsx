
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import LocationTable from "./location-table";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import LocationsFilter from "./locations-filter";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { LocationLifecycleEvent } from "@/types";
import { useLocationFilter } from "@/features/inventory/hooks/use-location-filter";

export type LocationsViewProps = {
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
}
export default function LocationsView({ onLifecycleEvent }: LocationsViewProps) {
    const createLocationLink = useInventoryLink("createLocation");
    const { filter, updateCriteria, updatePage } = useLocationFilter();

    return (
        <Card className="gap-3">
            <CardContent className="grid gap-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:flex-1">
                        <LocationsFilter onChange={updateCriteria} />
                    </div>
                    {createLocationLink && (
                        <Button className="self-start sm:self-end" variant="outline" asChild>
                            <Link to="new">
                                Add location
                            </Link>
                        </Button>
                    )}
                </div>
                <LocationTable
                    filter={filter}
                    onPageChange={updatePage}
                    onLifecycleEvent={onLifecycleEvent}
                />
            </CardContent>
        </Card>
    );
}
