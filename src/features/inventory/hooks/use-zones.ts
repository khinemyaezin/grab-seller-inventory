
import { zoneService } from "@/features/inventory/api/zone";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink, Pageable } from "@khinemyaezin/seller-api";
import { CreateZoneRequest, ListZoneResponse, UpdateZoneRequest, ZonesFilterForm } from "@/features/inventory/types";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useZones(link?: HateoasLink, locationId?: string, filter?: ZonesFilterForm & Pageable) {
  return useQuery<ListZoneResponse>({
    queryKey: ["zones", locationId, filter],
    queryFn: () => zoneService.searchZones(link!, { page: 0, size: 20, ...filter, locationId }),
    enabled: !!locationId && !!link,
    staleTime: 1000 * 60 * 5,
  });
}

export function useZone(link: HateoasLink, id: string) {
  const expendLink = resolveUrlTemplate({ "zoneId": id }, link);
  return useQuery<ZoneResponse>({
    queryKey: ["zone", id],
    queryFn: () => zoneService.getZone(expendLink),
    enabled: !!link,
    staleTime: 1000 * 60 * 5,

  });
}

export function useAddZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, { link: HateoasLink, request: CreateZoneRequest }>({
    mutationFn: ({ link, request }) => zoneService.createZone(link, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useUpdateZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, { link: HateoasLink, request: UpdateZoneRequest }>({
    mutationFn: ({ link, request }) => zoneService.update(link, request),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", _data.id] });
    }
  });
}

export function useRemoveZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, HateoasLink>({
    mutationFn: (link) => zoneService.removeZone(link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useActivateZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, HateoasLink>({
    mutationFn: (link: HateoasLink) => {
      return zoneService.activate(link);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", _data.id] });
    },
  });
}

export function useDeactivateZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation<ZoneResponse, Error, HateoasLink>({
    mutationFn: (link) => {
      return zoneService.deactivate(link);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone", _data.id] });
    },
  });
}
