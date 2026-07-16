// Models
export type {
  InventoryRoot,
  LocationType,
  ZoneType,
  LocationAddress,
  Bin,
  Zone,
  LocationLifecycleEvent,
  ZoneLifecycleEvent,
  BinLifecycleEvent,
  InventoryStatus,
  ReceiveStockMovementType,
  AdjustmentReason,
  ItemLifecycleEvent,
  CoverageGapKind,
  CoverageRow,
} from "./inventory.model";

export type {
  SearchProductVariantsRequest as SearchCatalogProductsRequest,
} from "./catalog.request";

export type {
  FullCatalogProductResponse,
  ProductVariantSearchResponse,
  VariantResponse,
  CatalogProductVariant,
} from "./catalog.response";

export {
  ZONE_TYPES,
  INVENTORY_STATUSES,
  RECEIVE_STOCK_TYPES,
  ADJUSTMENT_REASONS,
  COVERAGE_GAP_KINDS,
} from "./inventory.model";

// Request DTOs
export type {
  CreateLocationRequest,
  UpdateLocationRequest,
  CreateZoneRequest,
  UpdateZoneRequest,
  CreateBinRequest,
  UpdateBinRequest,
  CreateInventoryRequest,
  SearchInventoryRequest,
  ReceiveStockRequest,
  AdjustStockRequest,
} from "./inventory.request";

// Response DTOs
export type {
  LocationsResponse,
  ListZoneResponse,
  ZoneResponse,
  ListBinResponse,
  InventoryItemsResponse,
  StockMovementsResponse,
  BinResponse,
  LocationResponse,
  InventoryItemResponse,
  StockMovementResponse,
  ActivateZoneResponse,
  DeactivateZoneResponse,
} from "./inventory.response";

// Form Values
export type {
  LocationFormValues,
  LocationsFilterForm,
  ZoneFormValues,
  ZonesFilterForm,
  BinFormValues,
  BinsFilterForm,
  ItemFormValues,
  ItemsFilterForm,
  CoverageFilterForm,
  ReceiveStockFormValues,
  AdjustStockFormValues,
} from "./inventory.form";
