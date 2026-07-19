import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/features/inventory/api/item";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
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
import { useInventoryLink } from "./use-root";

export function useItems(searchLink?: HateoasLink, filters?: ItemsFilterForm & Pageable) {
  return useQuery<InventoryItemsResponse>({
    queryKey: ["inventory-items", searchLink?.href, filters],
    queryFn: () => itemService.searchItems(searchLink!, filters),
    enabled: !!searchLink,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryExistence(locationId?: string, skus?: string[]) {
  const checkExistenceLink = useInventoryLink("checkInventoryExistence");
  const uniqueSkus = Array.from(new Set((skus ?? []).map((sku) => sku.trim()).filter(Boolean))).slice(0, 100);
  const request: CheckInventoryExistenceRequest = {
    locationId: locationId!,
    skus: uniqueSkus,
  };
  return useQuery<CheckInventoryExistenceResponse>({
    queryKey: ["inventory-items", "existence", locationId, uniqueSkus],
    queryFn: () => itemService.checkExistence(checkExistenceLink!, request),
    enabled: !!checkExistenceLink,
    staleTime: 1000 * 60,
  });
}

export function useItem(link?: HateoasLink, itemId?: string) {
  const expandedLink = link && itemId
    ? resolveUrlTemplate({ inventoryItemId: itemId }, link)
    : undefined;

  return useQuery<InventoryItemResponse>({
    queryKey: ["inventory-item", itemId],
    queryFn: () => itemService.getItem(expandedLink!),
    enabled: !!expandedLink,
  });
}

export function useItemMovements(link?: HateoasLink, pageable?: Pageable) {
  return useQuery<StockMovementsResponse>({
    queryKey: ["inventory-item-movements", link?.href, pageable],
    queryFn: () => itemService.getMovements(link!, pageable),
    enabled: !!link,
    staleTime: 1000 * 60,
  });
}

export function useItemReservations(link?: HateoasLink, pageable?: Pageable) {
  return useQuery<InventoryReservationsResponse>({
    queryKey: ["inventory-item-reservations", link?.href, pageable],
    queryFn: () => itemService.getReservations(link!, pageable),
    enabled: !!link,
    staleTime: 1000 * 60,
  });
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: CreateInventoryRequest }>({
    mutationFn: ({ link, request }) => itemService.createItem(link, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-coverage"] });
    },
  });
}

export function useReceiveStockMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: ReceiveStockRequest }>({
    mutationFn: ({ link, request }) => itemService.receiveStock(link, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item", data.id] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item-movements"] });
    },
  });
}

export function useAdjustStockMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: AdjustStockRequest }>({
    mutationFn: ({ link, request }) => itemService.adjustStock(link, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item", data.id] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item-movements"] });
    },
  });
}

function invalidateItemQueries(queryClient: ReturnType<typeof useQueryClient>, itemId?: string) {
  queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
  if (itemId) {
    queryClient.invalidateQueries({ queryKey: ["inventory-item", itemId] });
  }
  queryClient.invalidateQueries({ queryKey: ["inventory-item-movements"] });
}

export function useMarkDamagedMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: MarkDamagedRequest }>({
    mutationFn: ({ link, request }) => itemService.markDamaged(link, request),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useWriteOffMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: WriteOffStockRequest }>({
    mutationFn: ({ link, request }) => itemService.writeOff(link, request),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useReturnToVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: ReturnToVendorRequest }>({
    mutationFn: ({ link, request }) => itemService.returnToVendor(link, request),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useSuspendInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => itemService.suspend(link),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useActivateInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => itemService.activate(link),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useDiscontinueInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink }>({
    mutationFn: ({ link }) => itemService.discontinue(link),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useTransferInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<TransferInventoryResponse, Error, { link: HateoasLink; request: TransferInventoryRequest }>({
    mutationFn: ({ link, request }) => itemService.transfer(link, request),
    onSuccess: (data) => {
      invalidateItemQueries(queryClient, data.source.id);
      invalidateItemQueries(queryClient, data.destination.id);
    },
  });
}

export function useAnnounceInTransitMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: AnnounceInTransitRequest }>({
    mutationFn: ({ link, request }) => itemService.announceInTransit(link, request),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useReceiveInTransitMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: ReceiveInTransitRequest }>({
    mutationFn: ({ link, request }) => itemService.receiveInTransit(link, request),
    onSuccess: (data) => invalidateItemQueries(queryClient, data.id),
  });
}

export function useUpdateReorderConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation<InventoryItemResponse, Error, { link: HateoasLink; request: UpdateReorderConfigRequest }>({
    mutationFn: ({ link, request }) => itemService.updateReorderConfig(link, request),
    onSuccess: (data) => {
      invalidateItemQueries(queryClient, data.id);
      queryClient.invalidateQueries({ queryKey: ["reorder-suggestions"] });
    },
  });
}

export function useReorderSuggestions(link?: HateoasLink, params?: { locationId?: string; sku?: string }) {
  return useQuery<ReorderSuggestionsResponse>({
    queryKey: ["reorder-suggestions", link?.href, params],
    queryFn: () => itemService.getReorderSuggestions(link!, params),
    enabled: !!link,
    staleTime: 1000 * 60,
  });
}
