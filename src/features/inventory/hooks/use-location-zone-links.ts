import { resolveLink } from "@khinemyaezin/seller-api";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { useZone } from "@/features/inventory/hooks/use-zones";

/**
 * Nested capability discovery for location → zone → bin routes.
 * Pages may use this for child collection/create/get links and breadcrumb names,
 * not for rendering location/zone domain UI.
 */
export function useLocationZoneLinks(locationId?: string, zoneId?: string) {
    const locationLink = useInventoryLink("location");
    const locationQuery = useLocation(locationLink, locationId);
    const location = locationQuery.data;

    const searchZones = resolveLink(location?._links, "search-zones");
    const createZone = resolveLink(location?._links, "create-zone");
    const zoneGetLink = resolveLink(location?._links, "zone");

    const zoneQuery = useZone(zoneGetLink, zoneId);
    const zone = zoneQuery.data;

    return {
        location,
        zone,
        locationName: location?.name,
        zoneName: zone?.name,
        searchZones,
        createZone,
        zoneGetLink,
        createBin: resolveLink(zone?._links, "create-bin"),
        binGetLink: resolveLink(zone?._links, "bin"),
        isLocationLoading: locationQuery.isLoading,
        isZoneLoading: zoneQuery.isLoading,
    };
}
