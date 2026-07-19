import type {
  AdjustmentReason,
  CoverageGapKind,
  InventoryStatus,
  LocationType,
  ReceiveStockMovementType,
  ZoneType,
} from "./inventory.model";

export type LocationFormValues = {
  code: string;
  name: string;
  type: LocationType;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export type LocationsFilterForm = {
  query?: string
};

export type ZoneFormValues = {
  code: string;
  name: string;
  type: ZoneType;
  active?: boolean;
}

export type ZonesFilterForm = {
  locationId?: string;
  query?: string;
  active?: boolean;
  type?: ZoneType;
};

export type BinFormValues = {
  code: string;
  name: string;
  maxCapacity: number;
  active?: boolean;
}

export type BinsFilterForm = {
  zoneId?: string;
  query?: string;
  active?: boolean;
};

export type ItemFormValues = {
  product: {
    sku:string,
    productName:string
  };
  productVariantId: string;
  locationId: string;
  initialQuantity: number;
  safetyStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number | "";
};

export type ItemsFilterForm = {
  sku?: string
};

export type CoverageFilterForm = {
  locationId?: string;
  productId?: string;
  gap?: CoverageGapKind | "ALL";
};

export type ReceiveStockFormValues = {
  quantity: number;
  type: ReceiveStockMovementType;
  referenceId: string;
};

export type AdjustStockFormValues = {
  newOnHandQuantity: number;
  reason: AdjustmentReason;
};

export type MarkDamagedFormValues = {
  quantity: number;
  notes: string;
};

export type WriteOffStockFormValues = {
  quantity: number;
  reason: string;
  notes: string;
};

export type ReturnToVendorFormValues = {
  quantity: number;
  reason: string;
  notes: string;
};

export type TransferInventoryFormValues = {
  toLocationId: string;
  quantity: number;
  notes: string;
};

export type AnnounceInTransitFormValues = {
  quantity: number;
  referenceId: string;
};

export type ReceiveInTransitFormValues = {
  quantity: number;
  referenceId: string;
};

export type UpdateReorderConfigFormValues = {
  safetyStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number | null;
};
