import { api, toPageParams, type HateoasLink } from "@khinemyaezin/seller-api";
import type {
  ProductVariantSearchResponse,
  SearchCatalogProductsRequest,
} from "@/features/inventory/types";

export const catalogService = {
  searchProducts: (link: HateoasLink, request: SearchCatalogProductsRequest) => {
    const { page, size, ...body } = request;
    return api.followLink<ProductVariantSearchResponse>(
      link,
      "POST",
      body,
      toPageParams({page,size}),
    );
  }
};