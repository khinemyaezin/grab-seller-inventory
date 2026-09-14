import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { LocationResponse, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";
import { LocationSummary } from "@/features/inventory/components/location/location-summary";
import ZonesView from "@/features/inventory/components/zone/zones-view";

export type LocationZonesViewProps = {
    locationId: string;
    location?: LocationResponse;
    searchLink?: HateoasLink;
    canCreate: boolean;
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
};

export default function LocationZonesView({
    locationId,
    location,
    searchLink,
    canCreate,
    onLifecycleEvent,
}: LocationZonesViewProps) {
    return (
        <div className="space-y-6">
            {location && <LocationSummary location={location} />}
            {searchLink && (
                <ZonesView
                    locationId={locationId}
                    link={searchLink}
                    canCreate={canCreate}
                    onLifecycleEvent={onLifecycleEvent}
                />
            )}
        </div>
    );
}
