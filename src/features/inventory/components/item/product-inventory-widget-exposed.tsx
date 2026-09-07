import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryCreateContext,
  InventoryPayload,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import ProductInventoryWidget from "./product-inventory-widget";
import useInventoryNewSlot, {
  type UseInventoryNewSlotProps,
} from "../../hooks/use-inventory-new-slot";

export type ProductInventoryWidgetExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

function ProductInventoryWidgetBound(props: UseInventoryNewSlotProps) {
  const { context, payload, ref, onChange } = useInventoryNewSlot(props);

  return (
    <ProductInventoryWidget
      ref={ref}
      context={context}
      value={payload}
      onChange={onChange}
    />
  );
}

export default function ProductInventoryWidgetExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY,
  context,
  initialValue,
  onChange,
  registerHandle,
  platform,
  entryLink,
}: ProductInventoryWidgetExposedProps) {
  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <ProductInventoryWidgetBound
          groupId={groupId}
          slotId={slotId}
          context={context as InventoryCreateContext | undefined}
          initialValue={initialValue as InventoryPayload | undefined}
          onChange={onChange as ((value: InventoryPayload) => void) | undefined}
          registerHandle={registerHandle}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
