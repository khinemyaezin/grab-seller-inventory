import type { HateoasLink, HateoasPageMetadata } from "@khinemyaezin/seller-api";

export interface CatalogProductVariant {
  id: string;
  sku: string;
  status: string;
  matrixKey: string;
}

export interface FullCatalogProductResponse {
  id: string;
  name: string;
  status: string;
  variants: CatalogProductVariant[];
}

export interface VariantResponse {
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  status: string;
  slug: string;
  categoryName: string;
  categoryId: string;
  _links?: Record<string, HateoasLink>;
}

export interface ProductVariantSearchResponse {
  _embedded?: {
    productVariantSearchResponseList: VariantResponse[];
  };
  _links?: Record<string, HateoasLink>;
  page: HateoasPageMetadata;
}
