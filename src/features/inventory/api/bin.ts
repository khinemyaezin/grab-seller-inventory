import { api } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateBinRequest, UpdateBinRequest } from "@/features/inventory/types";
import type { BinResponse, ListBinResponse } from "@/features/inventory/types/inventory.response";

export const binService = {
  listBins: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<ListBinResponse>(link, "GET", undefined, undefined, headers),

  getBin: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<BinResponse>(link, "GET", undefined, undefined, headers),

  createBin: (link: HateoasLink, request: CreateBinRequest, headers?: Record<string, string>) =>
    api.followLink<BinResponse>(link, "POST", request, undefined, headers),

  updateBin: (link: HateoasLink, request: UpdateBinRequest, headers?: Record<string, string>) =>
    api.followLink<BinResponse>(link, "PATCH", request, undefined, headers),

  activate: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<BinResponse>(link, "PATCH", undefined, undefined, headers),

  deactivate: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<BinResponse>(link, "PATCH", undefined, undefined, headers),

  removeBin: (link: HateoasLink, headers?: Record<string, string>) =>
    api.followLink<BinResponse>(link, "DELETE", undefined, undefined, headers),
};
