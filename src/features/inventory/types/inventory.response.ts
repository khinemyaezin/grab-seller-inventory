import type { HateoasLink, HateoasPageMetadata } from "@khinemyaezin/seller-api";
import type {
  Zone,
  ZoneType,
  InventoryStatus,
  LocationAddress,
  LocationType,
} from "./inventory.model";

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

export interface InventoryItemsResponse {
  _embedded: {
    inventoryResponseList: InventoryItemResponse[];
  };
  _links: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}

export interface StockMovementsResponse {
  _embedded: {
    stockMovementResponseList: StockMovementResponse[];
  };
  _links: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}

export interface InventoryReservationsResponse {
  _embedded?: {
    inventoryReservationResponseList?: InventoryReservationResponse[];
  };
  _links?: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}

export interface InventoryReservationResponse {
  id: string;
  inventoryItemId: string;
  orderId: string;
  orderLineId: string;
  quantity: number;
  status: string;
  expiresAt: string | null;
  idempotencyKey: string | null;
  _links?: Record<string, HateoasLink>;
}

export interface InventoryItemResponse {
  id: string;
  sku: string;
  merchantId: string;
  productName: string | null;
  locationId: string;
  locationCode: string;
  locationName: string;
  onHand: number;
  reserved: number;
  inTransit: number;
  damaged: number;
  available: number;
  status: InventoryStatus | string;
  safetyStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number | null;
  _links: Record<string, HateoasLink>;
}

export interface InventoryExistenceItem {
  sku: string;
  exists: boolean;
  inventoryItemId: string;
}

export interface CheckInventoryExistenceResponse {
  items: InventoryExistenceItem[];
  _links?: Record<string, HateoasLink>;
}

export interface StockMovementResponse {
  id: string;
  inventoryItemId: string;
  type: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  onHandBefore: number;
  onHandAfter: number;
  reservedBefore: number;
  reservedAfter: number;
  referenceId: string | null;
  createdAt: string;
  _links?: Record<string, HateoasLink>;
}

export interface TransferInventoryResponse {
  source: InventoryItemResponse;
  destination: InventoryItemResponse;
  transferId: string;
}

export interface ReorderSuggestionsResponse {
  _embedded?: {
    reorderSuggestionResponseList?: ReorderSuggestionResponse[];
    [key: string]: ReorderSuggestionResponse[] | undefined;
  };
  _links?: Record<string, HateoasLink>;
}

export interface ReorderSuggestionResponse {
  inventoryItemId: string;
  sku: string;
  productVariantId: string | null;
  locationId: string;
  currentAvailable: number;
  reorderPoint: number;
  suggestedQuantity: number;
  priority: string;
  _links?: Record<string, HateoasLink>;
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

export interface LocationResponse {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  active: boolean;
  address: LocationAddress;
  _links: Record<string, HateoasLink>;
}

export interface ActivateZoneResponse extends ZoneResponse{

}

export interface DeactivateZoneResponse extends ZoneResponse{

}
