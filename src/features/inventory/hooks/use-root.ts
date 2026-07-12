
import { useQuery } from "@tanstack/react-query";
import { fetchInventoryRoot } from "../api/discovery";
import type { InventoryRoot } from "@/features/inventory/types";
import { useEntryLink } from "@khinemyaezin/seller-ui";

export function useRoot() {
  const entryLink = useEntryLink();
  return useQuery<InventoryRoot>({
    queryKey: ["inventory-root", entryLink],
    queryFn: () => fetchInventoryRoot(entryLink!),
    enabled: !!entryLink,
    staleTime: Infinity,
  });
}

export function useInventoryLink(rel: keyof InventoryRoot) {
  return useRoot().data?.[rel]
}