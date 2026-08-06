import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { SellerPlatform } from "@khinemyaezin/seller-contracts";
import ProductInventoryWidget, {
  type InventoryFieldName,
  type InventoryLineValue,
} from "./product-inventory-widget";

export default function ProductInventoryWidgetExposed({
  sku,
  value,
  onChange,
  errors,
  onBlur,
  platform,
  entryLink,
}: {
  sku: string;
  value: InventoryLineValue;
  onChange: (next: InventoryLineValue) => void;
  errors?: Partial<Record<InventoryFieldName, string>>;
  onBlur?: (field: InventoryFieldName) => void;
  platform?: SellerPlatform;
  entryLink: HateoasLink;
}) {
  if (!entryLink) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <div className="seller-inventory-mfe">
          <ProductInventoryWidget
            sku={sku}
            value={value}
            onChange={onChange}
            errors={errors}
            onBlur={onBlur}
            platform={platform}
            entryLink={entryLink}
          />
        </div>
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
