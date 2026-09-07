import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryCreateContext,
  InventoryPayload,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import InlineInventoryWidget from "./inline-inventory-widget";
import useInventoryNewSlot, {
  type UseInventoryNewSlotProps,
} from "../../hooks/use-inventory-new-slot";

export type InlineInventoryWidgetExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

function InlineInventoryWidgetBound(props: UseInventoryNewSlotProps) {
  const { context, payload, ref, onChange } = useInventoryNewSlot(props);

  return (
    <InlineInventoryWidget
      ref={ref}
      value={payload}
      context={context}
      onChange={onChange}
    />
  );
}

export default function InlineInventoryWidgetExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY_INLINE,
  context,
  initialValue,
  onChange,
  registerHandle,
  platform,
  entryLink,
}: InlineInventoryWidgetExposedProps) {
  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <InlineInventoryWidgetBound
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
