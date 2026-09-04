import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryCreateContext,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import InlineInventoryWidget from "./inline-inventory-widget";
import useInventoryNewSlot from "../../hooks/use-inventory-new-slot";

export type InlineInventoryWidgetExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};


export default function InlineInventoryWidgetExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY_INLINE,
  context: initialContext,
  platform,
  entryLink,
}: InlineInventoryWidgetExposedProps) {
  const { context, payload, ref, onChange } = useInventoryNewSlot({ groupId, slotId, platform, initialContext: initialContext as InventoryCreateContext });
  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <InlineInventoryWidget
          ref={ref}
          value={payload}
          context={context}
          onChange={onChange}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
