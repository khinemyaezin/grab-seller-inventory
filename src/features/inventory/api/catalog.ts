import { api, type HateoasLink } from "@khinemyaezin/seller-api";
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
      { page: String(page), size: String(size) },
    );
  }
};