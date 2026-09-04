import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryEditContext,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import InventoryItemEdit from "./inventory-item-edit";
import useInventoryEditSlot from "../../hooks/use-inventory-edit-slot";

export type InventoryItemEditExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

export default function InventoryItemEditExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.EDIT_INVENTORY,
  context: initialContext,
  platform,
  entryLink,
}: InventoryItemEditExposedProps) {
  const { context, payload, ref, onChange } = useInventoryEditSlot({
    groupId,
    slotId,
    platform,
    initialContext: initialContext as InventoryEditContext | undefined,
  });

  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <InventoryItemEdit
          ref={ref}
          context={context}
          value={payload}
          onChange={onChange}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
