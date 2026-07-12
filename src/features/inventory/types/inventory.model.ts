import type { HateoasLink } from "@khinemyaezin/seller-api";

export type LocationType = "WAREHOUSE" | "STORE" | "DISTRIBUTION_CENTER";

export type ZoneType = "PICKING" | "STORAGE" | "STAGING" | "RETURNS" | "DAMAGED" | "RECEIVING";

export const ZONE_TYPES: ZoneType[] = ["PICKING" , "STORAGE" , "STAGING" , "RETURNS" , "DAMAGED" , "RECEIVING"];

export interface InventoryRoot {
  self?: HateoasLink;
  pagedLocation?: HateoasLink;
  location?:  HateoasLink;
  createLocation?: HateoasLink;
}

export interface LocationAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Bin {
  id: string;
  code: string;
  name: string;
  maxCapacity: number;
  active: boolean;
}

export interface BinResponse {
  id: string;
  zoneId: string;
  code: string;
  name: string;
  maxCapacity: number;
  active: boolean;
  _links: Record<string, HateoasLink>;
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  type: ZoneType;
  active: boolean;
}

export interface LocationResponse {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  active: boolean;
  address: LocationAddress;
  _links: Record<string, HateoasLink>;
}
