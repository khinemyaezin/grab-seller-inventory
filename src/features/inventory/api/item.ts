import { api, toPageParams } from "@khinemyaezin/seller-api";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type {
  AdjustStockRequest,
  CheckInventoryExistenceRequest,
  CheckInventoryExistenceResponse,
  CreateInventoryRequest,
  InventoryItemResponse,
  InventoryItemsResponse,
  ItemsFilterForm,
  MarkDamagedRequest,
  ReceiveStockRequest,
  ReturnToVendorRequest,
  StockMovementsResponse,
  TransferInventoryRequest,
  TransferInventoryResponse,
  WriteOffStockRequest,
  InventoryReservationsResponse,
  AnnounceInTransitRequest,
  ReceiveInTransitRequest,
  UpdateReorderConfigRequest,
  ReorderSuggestionsResponse,
} from "@/features/inventory/types";

export const itemService = {
  createItem: (link: HateoasLink, request: CreateInventoryRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  getItem: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "GET", undefined, undefined, headers),

  searchItems: (link: HateoasLink, filters?: ItemsFilterForm & Pageable) => {
    const { page = 0, size = 20, ...body } = filters ?? {};
    return api.followLink<InventoryItemsResponse>(
      link,
      "POST",
      body,
      toPageParams({ page, size }),
    );
  },

  checkExistence: (link: HateoasLink, request: CheckInventoryExistenceRequest, headers?: Record<string, string>) =>
    api.followLink<CheckInventoryExistenceResponse>(link, "POST", request, undefined, headers),

  receiveStock: (link: HateoasLink, request: ReceiveStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  adjustStock: (link: HateoasLink, request: AdjustStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  markDamaged: (link: HateoasLink, request: MarkDamagedRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  writeOff: (link: HateoasLink, request: WriteOffStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  returnToVendor: (link: HateoasLink, request: ReturnToVendorRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  suspend: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", undefined, undefined, headers),

  activate: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", undefined, undefined, headers),

  discontinue: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", undefined, undefined, headers),

  transfer: (link: HateoasLink, request: TransferInventoryRequest, headers?: Record<string, string>) =>
    api.followLink<TransferInventoryResponse>(link, "POST", request, undefined, headers),

  getMovements: (link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) =>
    api.followLink<StockMovementsResponse>(link, "GET", undefined, toPageParams(pageable), headers),

  getReservations: (link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) =>
    api.followLink<InventoryReservationsResponse>(link, "GET", undefined, toPageParams(pageable), headers),

  announceInTransit: (link: HateoasLink, request: AnnounceInTransitRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  receiveInTransit: (link: HateoasLink, request: ReceiveInTransitRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  updateReorderConfig: (link: HateoasLink, request: UpdateReorderConfigRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "PUT", request, undefined, headers),

  getReorderSuggestions: (link: HateoasLink, params?: { locationId?: string; sku?: string }, headers?: Record<string, string>) =>
    api.followLink<ReorderSuggestionsResponse>(link, "GET", undefined, params, headers),
};
