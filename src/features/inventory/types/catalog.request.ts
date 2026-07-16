export interface SearchProductVariantsRequest {
  query?: string;
  variantStatus?: string;
  categoryId?: string;
  productStatus?: string;
  page: number;
  size: number;
}
