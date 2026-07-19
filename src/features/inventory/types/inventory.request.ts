import type {
  AdjustmentReason,
  LocationType,
  ReceiveStockMovementType,
  ZoneType,
} from "./inventory.model";

export interface CreateLocationRequest {
  code: string;
  name: string;
  type: LocationType;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface UpdateLocationRequest {
  code?: string;
  name?: string;
  type?: LocationType;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface CreateZoneRequest {
  code: string;
  name: string;
  type: ZoneType;
  active?: boolean;
}

export interface UpdateZoneRequest {
  code?: string;
  name?: string;
  type?: ZoneType;
  active?: boolean;
}

export interface CreateBinRequest {
  zoneId: string;
  code: string;
  name?: string;
  maxCapacity?: number;
}

export interface UpdateBinRequest {
  code?: string;
  name?: string;
  maxCapacity?: number;
  active?: boolean;
}




export interface CreateInventoryRequest {
  sku: string;
  productVariantId?: string;
  locationId: string;
  initialQuantity: number;
  safetyStock?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  maxStock?: number;
}

export interface SearchInventoryRequest {
  sku?: string;
  locationId?: string;
  status?: string;
}

export interface CheckInventoryExistenceRequest {
  locationId: string;
  skus: string[];
}

export interface ReceiveStockRequest {
  quantity: number;
  type: ReceiveStockMovementType;
  referenceId?: string;
}

export interface AdjustStockRequest {
  newOnHandQuantity: number;
  reason: AdjustmentReason;
}

export interface MarkDamagedRequest {
  quantity: number;
  notes?: string;
}

export interface WriteOffStockRequest {
  quantity: number;
  reason: string;
  notes?: string;
}

export interface ReturnToVendorRequest {
  quantity: number;
  reason: string;
  notes?: string;
}

export interface TransferInventoryRequest {
  toLocationId: string;
  quantity: number;
  notes?: string;
}

export interface AnnounceInTransitRequest {
  quantity: number;
  referenceId?: string;
}

export interface ReceiveInTransitRequest {
  quantity: number;
  referenceId?: string;
}

export interface UpdateReorderConfigRequest {
  safetyStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock?: number | null;
}
