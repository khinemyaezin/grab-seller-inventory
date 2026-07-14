import { CreateZoneRequest, ListZoneResponse, UpdateZoneRequest, ZonesFilterForm } from "@/features/inventory/types";
import { api } from "@khinemyaezin/seller-api";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";

export const zoneService = {
    createZone: (link: HateoasLink, request: CreateZoneRequest, headers?: Record<string, string>) =>
        api.followLink<ZoneResponse>(link, "POST", request, undefined, headers),

    searchZones: (link: HateoasLink, filters?: ZonesFilterForm & Pageable, headers?: Record<string, string>) =>
        api.followLink<ListZoneResponse>(link, "POST", filters, undefined, headers),

    getZone: (link: HateoasLink, headers?: Record<string, string>) =>
        api.followLink<ZoneResponse>(link, "GET", undefined, undefined, headers),

    removeZone: (link: HateoasLink, headers?: Record<string, string>) =>
        api.followLink<ZoneResponse>(link, "DELETE", undefined, undefined, headers),

    activate: (link: HateoasLink, headers?: Record<string, string>) =>
        api.followLink<ZoneResponse>(link, "PATCH", undefined, undefined, headers),

    deactivate: (link: HateoasLink, headers?: Record<string, string>) =>
        api.followLink<ZoneResponse>(link, "PATCH", undefined, undefined, headers),

    update: (link: HateoasLink, body: UpdateZoneRequest, headers?: Record<string, string>) =>
        api.followLink<ZoneResponse>(link, "PATCH", body, undefined, headers),
}
