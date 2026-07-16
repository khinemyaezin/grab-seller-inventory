import { useProductSearch } from "@/features/inventory/hooks/use-catalog";
import { MagicSearch, DisplayItem } from "@khinemyaezin/seller-ui/components/magic-search";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState, ComponentPropsWithoutRef } from "react";
import { VariantResponse } from "@/types";

export type ProductSearchProps = {
    onChange: (value: string) => void;
    onSelectProduct?: (product: VariantResponse | null) => void;
    value: string;
};

export default function ProductSearch({ value, onChange, onSelectProduct, ...inputProps }: ComponentPropsWithoutRef<typeof Input> & ProductSearchProps) {
    const [query, setQuery] = useState<string>(value || "");
    const { data, isLoading } = useProductSearch({ query, page: 0, size: 10 });

    const products = data?._embedded?.productVariantSearchResponseList ?? [];
    const items: DisplayItem[] = products.map((product) => ({
        id: product.variantId,
        name: product.sku,
    }));

    useEffect(() => {
        setQuery(value || "");
    }, [value]);

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery);
        onChange(newQuery);
    };

    return (
        <MagicSearch
            items={items}
            onQueryChange={handleQueryChange}
            onQueryClear={() => {
                onChange("");
                onSelectProduct?.(null);
            }}
            onSelect={(item) => {
                onChange(item.name);
                const selected = products.find(p => p.variantId === item.id);
                if (selected) {
                    onSelectProduct?.(selected);
                }
            }}
            isLoading={isLoading}
            initialQuery={value || ""}
            renderInput={(props) => (
                <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        {...inputProps}
                        {...props}
                        type="text"
                        placeholder="Search product..."
                        id={inputProps.id ?? "product-search"}
                        className="pl-9"
                    />
                </div>
            )}
        />
    );
}
