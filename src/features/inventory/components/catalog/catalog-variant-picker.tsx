import { useMemo, useState } from "react";
import { ChevronRightIcon, ExternalLink, ImageIcon, SearchIcon } from "lucide-react";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemActions,
  ItemMedia,
} from "@khinemyaezin/seller-ui/components/item";
import { RadioGroup, RadioGroupItem } from "@khinemyaezin/seller-ui/components/radio-group";
import { FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import { useProductSearch } from "@/features/inventory/hooks/use-catalog";
import { useInventoryExistence } from "@/features/inventory/hooks/use-items";
import type { InventoryExistenceItem, VariantResponse } from "@/features/inventory/types";

const PAGE_SIZE = 5;

export type CatalogVariantPickerProps = {
  locationId?: string;
  selectedVariantId?: string;
  onSelect: (variant: CatalogVariantPickerEvent) => void;
};

type VariantAvailability = InventoryExistenceItem | undefined;
export type CatalogVariantPickerEvent = {
  product: {
    id: string,
    sku: string,
    name: string
  }
  inventory?: {
    id: string
  }
}

export default function CatalogVariantPicker({
  locationId,
  selectedVariantId,
  onSelect,
}: CatalogVariantPickerProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const productSearch = useProductSearch(locationId ? {
    query: query.trim() || undefined,
    variantStatus: "ACTIVE",
    page,
    size: PAGE_SIZE,
  } : undefined);

  const variants = productSearch.data?._embedded?.productVariantSearchResponseList ?? [];

  const skus = useMemo(() =>
    variants.map((variant) => variant.sku),
    [variants]);
  const existence = useInventoryExistence(locationId, skus);

  const existenceBySku = useMemo(() => {
    const items = existence.data?.items ?? [];
    return new Map(items.map((item) => [item.sku, item]));
  }, [existence.data?.items]);

  const isDisabled = !locationId;
  const showPagination = (productSearch.data?.page.totalPages ?? 0) > 1;
  const isLoading = productSearch.isLoading || existence.isLoading;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(0);
  };

  const handleOnSelect = (product: VariantResponse) => {
    const inventory = existenceBySku.get(product.sku);

    const event: CatalogVariantPickerEvent = {
      product: {
        id: product.variantId,
        sku: product.sku,
        name: product.productName
      },
      ...(inventory?.exists && { inventory: { id: inventory.inventoryItemId } })
    };
    onSelect?.(event)
  }

  return (
    <div className="grid gap-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder={isDisabled ? "Select a location first" : "Search by product name or SKU"}
          disabled={isDisabled}
          className="pl-9"
        />
      </div>

      <RadioGroup
        value={selectedVariantId}
        onValueChange={(val) => {
          const variant = variants.find((v) => v.variantId === val);
          if (variant) handleOnSelect(variant);
        }}
      >
        <ItemGroup>
          {isDisabled ? (
            <div className="text-muted-foreground text-center py-8 border border-transparent rounded-md">
              Select a location to check product availability.
            </div>
          ) : isLoading && variants.length === 0 ? (
            <div className="text-muted-foreground text-center py-8 border border-transparent rounded-md">
              Loading products...
            </div>
          ) : variants.length > 0 ? (
            variants.map((variant) => (
              <CatalogVariantRow
                key={variant.variantId}
                variant={variant}
                availability={existenceBySku.get(variant.sku)}
                selected={selectedVariantId === variant.variantId}
                onSelect={handleOnSelect}
              />
            ))
          ) : (
            <div className="text-muted-foreground text-center py-8 border border-transparent rounded-md">
              No product variants found.
            </div>
          )}

          {showPagination && productSearch.data?.page && (
            <div className="flex w-full items-center justify-between py-3">
              <span className="text-muted-foreground shrink-0 text-sm">
                Showing {productSearch.data.page.number * productSearch.data.page.size + 1} -{" "}
                {productSearch.data.page.number * productSearch.data.page.size + variants.length} of{" "}
                {productSearch.data.page.totalElements} variants
              </span>
              <Pager
                className="justify-end"
                onPageChange={setPage}
                {...productSearch.data.page}
              />
            </div>
          )}
        </ItemGroup>
      </RadioGroup>
    </div>
  );
}

function CatalogVariantRow({
  variant,
  availability,
  selected,
  onSelect
}: {
  variant: VariantResponse;
  availability: VariantAvailability;
  selected: boolean;
  onSelect: (variant: VariantResponse) => void;
}) {
  const alreadyTracked = availability?.exists === true;

  return (
    <Item
      asChild
      variant={selected ? "outline" : "default"}
      className="cursor-pointer hover:bg-muted/50 hover:border-border transition-colors"
    >
      <FieldLabel onClick={() => onSelect(variant)}>
        <ItemMedia variant="image" className="bg-secondary">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{variant.sku}</ItemTitle>
          <ItemDescription>
            {variant.productName}
          </ItemDescription>
        </ItemContent>
        {alreadyTracked && <Badge variant="secondary">Already tracked</Badge>}
        <ItemActions>
          <RadioGroupItem
            value={variant.variantId}
            id={`variant-${variant.variantId}`}
            disabled={alreadyTracked}
            hidden
          />
          {alreadyTracked ? (<ExternalLink className="size-4" />) : (<ChevronRightIcon className="size-4" />
          )}
        </ItemActions>
      </FieldLabel>
    </Item>
  );
}
