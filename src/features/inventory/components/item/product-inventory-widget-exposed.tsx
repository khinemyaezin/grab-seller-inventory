import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryCreateContext,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import ProductInventoryWidget from "./product-inventory-widget";
import useInventoryNewSlot from "../../hooks/use-inventory-new-slot";

export type ProductInventoryWidgetExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

export default function ProductInventoryWidgetExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY,
  context: initialContext,
  platform,
  entryLink,
}: ProductInventoryWidgetExposedProps) {
  const { context, payload, ref, onChange } = useInventoryNewSlot({ groupId, slotId, platform, initialContext: initialContext as InventoryCreateContext });
  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <ProductInventoryWidget
          ref={ref}
          context={context}
          value={payload}
          onChange={onChange}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
