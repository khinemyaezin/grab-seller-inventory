
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { locationService } from "@/features/inventory/api/location";
import { resolveUrlTemplate } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  LocationResponse,
  LocationsResponse,
  CreateLocationRequest,
  UpdateLocationRequest,
  CreateBinRequest,
  UpdateBinRequest,
  LocationType,
} from "@/features/inventory/types";

export function useLocations(locationsLink: HateoasLink, filters?: { active?: boolean; type?: LocationType; page?: number; size?: number }) {
  return useQuery<LocationsResponse>({
    queryKey: ["locations", locationsLink.href, filters],
    queryFn: () => locationService.listLocations(locationsLink!, filters, { "X-Actor-Id": "seller-001" }),
    enabled: !!locationsLink,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLocation(link?: HateoasLink, locationId?: string) {
  const expendLink = resolveUrlTemplate({ "locationId": locationId! }, link!)
  return useQuery<LocationResponse>({
    queryKey: ["location", locationId],
    queryFn: () => locationService.getLocation(expendLink, { "X-Actor-Id": "seller-001" }),
    enabled: !!link && !!locationId,
  });
}

export function useCreateLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, { link: HateoasLink, request: CreateLocationRequest }>({
    mutationFn: ({ link: locationsLink, request }) => locationService.createLocation(locationsLink, request, { "X-Actor-Id": "seller-001" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

export function useUpdateLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, { link: HateoasLink; request: UpdateLocationRequest }>({
    mutationFn: ({ link, request }) => locationService.update(link, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", _data.id] });
    },
  });
}

export function useActivateLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, HateoasLink>({
    mutationFn: (link) => locationService.activate(link),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", _data.id] });
    },
  });
}

export function useDeactivateLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation<LocationResponse, Error, HateoasLink>({
    mutationFn: (link) => locationService.deactivate(link),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", _data.id] });
    },
  });
}

export function useDeleteLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, HateoasLink>({
    mutationFn: (link) => locationService.removeLocation(link, { "X-Actor-Id": "seller-001" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}