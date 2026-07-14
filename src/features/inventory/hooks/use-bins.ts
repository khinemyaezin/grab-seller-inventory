
import { binService } from "@/features/inventory/api/bin";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import type { BinsFilterForm, CreateBinRequest, UpdateBinRequest } from "@/features/inventory/types";
import type { BinResponse, ListBinResponse } from "@/features/inventory/types/inventory.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBins(link?: HateoasLink, zoneId?: string, filter?: BinsFilterForm & Pageable) {
  return useQuery<ListBinResponse>({
    queryKey: ["bins", zoneId, filter],
    queryFn: () => binService.searchBins(link!, { page: 0, size: 20, ...filter, zoneId }),
    enabled: !!zoneId && !!link,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBin(link?: HateoasLink, id?: string) {
  const expandedLink = resolveUrlTemplate({ binId: id! }, link!);
  return useQuery<BinResponse>({
    queryKey: ["bin", id],
    queryFn: () => binService.getBin(expandedLink),
    enabled: !!link && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBinMutation() {
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, { link: HateoasLink; request: CreateBinRequest }>({
    mutationFn: ({ link, request }) => binService.createBin(link, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });
}

export function useUpdateBinMutation() {
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, { link: HateoasLink; request: UpdateBinRequest }>({
    mutationFn: ({ link, request }) => binService.updateBin(link, request),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", _data.id] });
    },
  });
}

export function useActivateBinMutation() {
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, HateoasLink>({
    mutationFn: (link) => binService.activate(link),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", _data.id] });
    },
  });
}

export function useDeactivateBinMutation() {
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, HateoasLink>({
    mutationFn: (link) => binService.deactivate(link),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      queryClient.invalidateQueries({ queryKey: ["bin", _data.id] });
    },
  });
}

export function useDeleteBinMutation() {
  const queryClient = useQueryClient();
  return useMutation<BinResponse, Error, HateoasLink>({
    mutationFn: (link) => binService.removeBin(link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
    },
  });
}
