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

  searchLocations: (link: HateoasLink, filters?: LocationsFilterForm & Pageable) => {
   
    return api.followLink<LocationsResponse>(link, "POST", filters);
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
