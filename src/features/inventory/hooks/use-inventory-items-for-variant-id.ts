import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/features/inventory/api/item";
import type { InventoryItemResponse } from "@/features/inventory/types";
import { useInventoryLink } from "./use-root";

export function useInventoryItemsForVariantId(variantId?: string) {
  const searchLink = useInventoryLink("searchInventoryItems");
  const trimmed = variantId?.trim();

  return useQuery<InventoryItemResponse[]>({
    queryKey: ["inventory-items-for-variant-id", trimmed],
    queryFn: async () => {
      const search = await itemService.searchItems(searchLink!, {
        variantId: trimmed,
        page: 0,
        size: 100,
      });
      return search._embedded?.inventoryResponseList ?? [];
    },
    enabled: !!searchLink && !!trimmed,
    staleTime: 1000 * 60,
  });
}
