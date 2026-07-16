import { api } from "@khinemyaezin/seller-api";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type {
  AdjustStockRequest,
  CreateInventoryRequest,
  InventoryItemResponse,
  InventoryItemsResponse,
  ItemsFilterForm,
  ReceiveStockRequest,
  StockMovementsResponse,
} from "@/features/inventory/types";

function toPageParams(pageable?: Pageable): Record<string, string> | undefined {
  if (!pageable) return undefined;
  return {
    page: String(pageable.page),
    size: String(pageable.size),
  };
}

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

  receiveStock: (link: HateoasLink, request: ReceiveStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  adjustStock: (link: HateoasLink, request: AdjustStockRequest, headers?: Record<string, string>) =>
    api.followLink<InventoryItemResponse>(link, "POST", request, undefined, headers),

  getMovements: (link: HateoasLink, pageable?: Pageable, headers?: Record<string, string>) =>
    api.followLink<StockMovementsResponse>(link, "GET", undefined, toPageParams(pageable), headers),
};
