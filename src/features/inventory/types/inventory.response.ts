import type { HateoasLink, HateoasPageMetadata } from "@khinemyaezin/seller-api";
import type { BinResponse, LocationResponse, Zone, ZoneType } from "./inventory.model";
export type { BinResponse } from "./inventory.model";

export interface InventoryRootResponse {
  _links: Record<string, HateoasLink>;
}

export interface LocationsResponse {
  _embedded: {
    locationResponseList: LocationResponse[];
  };
  _links: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}

export interface ListZoneResponse {
  _embedded: {
    zoneResponseList: ZoneResponse[];
  };
  _links: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}

export interface ZoneResponse {
  id: string;
  code: string;
  name: string;
  type: ZoneType;
  active: boolean;
  _links: Record<string, HateoasLink>;
}

export interface ListBinResponse {
  _embedded: {
    binResponseList: BinResponse[];
  };
  _links: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}
