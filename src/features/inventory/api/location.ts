import { api } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  LocationResponse,
  LocationsResponse,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationsFilterForm,
} from "@/features/inventory/types";
import type { Pageable } from "@khinemyaezin/seller-api";

export const locationService = {
  createLocation: (link: HateoasLink, request: CreateLocationRequest, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "POST", request, undefined, headers),

  getLocation: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "GET", undefined, undefined, headers),

  getLocationByCode: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "GET", undefined, undefined, headers),

  listLocations: (link: HateoasLink, filters?: LocationsFilterForm & Pageable, headers?: Record<string, string>) => {
    const params: Record<string, string> = {};
    if (filters?.active !== undefined) params.active = String(filters.active);
    if (filters?.type) params.type = filters.type;
    if (filters?.page !== undefined) params.page = String(filters.page);
    if (filters?.size !== undefined) params.size = String(filters.size);
    return api.followLink<LocationsResponse>(link, "GET", undefined, params, headers);
  },

  removeLocation: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<void>(link, "DELETE", undefined, undefined, headers),

  activate: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "PATCH", undefined, undefined, headers),

  deactivate: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "PATCH", undefined, undefined, headers),

  update: (link: HateoasLink, body: UpdateLocationRequest, headers?: Record<string, string>) =>
    api.followLink<LocationResponse>(link, "PATCH", body, undefined, headers),
};
