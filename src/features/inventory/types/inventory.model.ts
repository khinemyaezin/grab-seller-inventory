import type { HateoasLink } from "@khinemyaezin/seller-api";

export type LocationType = "WAREHOUSE" | "STORE";

export type ZoneType = "PICKING" | "STORAGE" | "STAGING" | "RETURNS" | "DAMAGED" | "RECEIVING";

export const ZONE_TYPES: ZoneType[] = ["PICKING", "STORAGE", "STAGING", "RETURNS", "DAMAGED", "RECEIVING"];

export interface InventoryRoot {
  self?: HateoasLink;
  searchLocation?: HateoasLink;
  location?: HateoasLink;
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

export type LocationLifecycleEvent =
  | { type: "titleResolved", title: string }
  | { type: "created" }
  | { type: "createFailed" }
  | { type: "updated" }
  | { type: "updateFailed" }
  | { type: "activated" }
  | { type: "activateFailed" }
  | { type: "deactivated" }
  | { type: "deactivateFailed" }
  | { type: "deleted" }
  | { type: "deleteFailed" };

export type ZoneLifecycleEvent =
  | { type: "titleResolved", title: string }
  | { type: "created" }
  | { type: "createFailed" }
  | { type: "updated" }
  | { type: "updateFailed" }
  | { type: "activated" }
  | { type: "activateFailed" }
  | { type: "deactivated" }
  | { type: "deactivateFailed" }
  | { type: "deleted" }
  | { type: "deleteFailed" };

export type BinLifecycleEvent =
  | { type: "titleResolved", title: string }
  | { type: "created" }
  | { type: "createFailed" }
  | { type: "updated" }
  | { type: "updateFailed" }
  | { type: "activated" }
  | { type: "activateFailed" }
  | { type: "deactivated" }
  | { type: "deactivateFailed" }
  | { type: "deleted" }
  | { type: "deleteFailed" };
