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
  CheckInventoryExistenceRequest,
  ReceiveStockRequest,
  AdjustStockRequest,
  MarkDamagedRequest,
  WriteOffStockRequest,
  ReturnToVendorRequest,
  TransferInventoryRequest,
  AnnounceInTransitRequest,
  ReceiveInTransitRequest,
  UpdateReorderConfigRequest,
} from "./inventory.request";

// Response DTOs
export type {
  LocationsResponse,
  ListZoneResponse,
  ZoneResponse,
  ListBinResponse,
  InventoryItemsResponse,
  CheckInventoryExistenceResponse,
  InventoryExistenceItem,
  StockMovementsResponse,
  BinResponse,
  LocationResponse,
  InventoryItemResponse,
  StockMovementResponse,
  InventoryReservationResponse,
  InventoryReservationsResponse,
  TransferInventoryResponse,
  ReorderSuggestionsResponse,
  ReorderSuggestionResponse,
  ActivateZoneResponse,
  DeactivateZoneResponse,
  InventoryCountPercent,
  InventoryStatusBreakdown,
  InventoryHealthBreakdown,
  InventoryQuantityTotals,
  InventorySummaryResponse,
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
  MarkDamagedFormValues,
  WriteOffStockFormValues,
  ReturnToVendorFormValues,
  TransferInventoryFormValues,
  AnnounceInTransitFormValues,
  ReceiveInTransitFormValues,
  UpdateReorderConfigFormValues,
} from "./inventory.form";
