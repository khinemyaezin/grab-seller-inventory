import type { HateoasLink } from "@khinemyaezin/seller-api";

export type LocationType = "WAREHOUSE" | "STORE";

export type ZoneType = "PICKING" | "STORAGE" | "STAGING" | "RETURNS" | "DAMAGED" | "RECEIVING";

export const ZONE_TYPES: ZoneType[] = ["PICKING", "STORAGE", "STAGING", "RETURNS", "DAMAGED", "RECEIVING"];

export interface InventoryRoot {
  self?: HateoasLink;
  searchLocation?: HateoasLink;
  location?: HateoasLink;
  createLocation?: HateoasLink;
  searchInventoryItems?: HateoasLink;
  createInventoryItem?: HateoasLink;
  inventoryItem?: HateoasLink;
  checkInventoryExistence?: HateoasLink;
  searchProductVariants?: HateoasLink;
  reorderSuggestions?: HateoasLink;
}

export type InventoryStatus = "ACTIVE" | "DISCONTINUED" | "OUT_OF_STOCK" | "SUSPENDED";

export const INVENTORY_STATUSES: InventoryStatus[] = [
  "ACTIVE",
  "DISCONTINUED",
  "OUT_OF_STOCK",
  "SUSPENDED",
];

export type ReceiveStockMovementType =
  | "PURCHASE_ORDER_RECEIPT"
  | "CUSTOMER_RETURN"
  | "TRANSFER_IN"
  | "INITIAL_STOCK";

export const RECEIVE_STOCK_TYPES: ReceiveStockMovementType[] = [
  "PURCHASE_ORDER_RECEIPT",
  "CUSTOMER_RETURN",
  "TRANSFER_IN",
  "INITIAL_STOCK",
];

export type AdjustmentReason =
  | "CYCLE_COUNT"
  | "DAMAGED"
  | "EXPIRED"
  | "LOST"
  | "FOUND"
  | "THEFT"
  | "CORRECTION";

export const ADJUSTMENT_REASONS: AdjustmentReason[] = [
  "CYCLE_COUNT",
  "DAMAGED",
  "EXPIRED",
  "LOST",
  "FOUND",
  "THEFT",
  "CORRECTION",
];



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


export interface Zone {
  id: string;
  code: string;
  name: string;
  type: ZoneType;
  active: boolean;
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

export type ItemLifecycleEvent =
  | { type: "titleResolved"; title: string }
  | { type: "navigation"; itemId:string }
  | { type: "created" }
  | { type: "createFailed"; message: string }
  | { type: "received" }
  | { type: "receiveFailed" }
  | { type: "adjusted" }
  | { type: "adjustFailed" }
  | { type: "damaged" }
  | { type: "damageFailed" }
  | { type: "writtenOff" }
  | { type: "writeOffFailed" }
  | { type: "returnedToVendor" }
  | { type: "returnToVendorFailed" }
  | { type: "suspended" }
  | { type: "suspendFailed" }
  | { type: "activated" }
  | { type: "activateFailed" }
  | { type: "discontinued" }
  | { type: "discontinueFailed" }
  | { type: "transferred" }
  | { type: "transferFailed" }
  | { type: "inTransitAnnounced" }
  | { type: "inTransitAnnounceFailed" }
  | { type: "inTransitReceived" }
  | { type: "inTransitReceiveFailed" }
  | { type: "reorderConfigUpdated" }
  | { type: "reorderConfigUpdateFailed" };

/** Gap kinds surfaced on the stock coverage page. */
export type CoverageGapKind = "UNSTOCKED" | "ZERO_AVAILABLE" | "LOW_STOCK";

export const COVERAGE_GAP_KINDS: CoverageGapKind[] = [
  "UNSTOCKED",
  "ZERO_AVAILABLE",
  "LOW_STOCK",
];

export interface CoverageRow {
  key: string;
  sku: string;
  productId?: string;
  productName?: string;
  productVariantId?: string | null;
  locationId: string;
  gap: CoverageGapKind;
  available?: number;
  reorderPoint?: number;
  itemId?: string;
}
