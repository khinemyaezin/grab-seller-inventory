import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryEditContext,
  InventoryEditPayload,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import InventoryItemEdit from "./inventory-item-edit";
import useInventoryEditSlot, {
  type UseInventoryEditSlotProps,
} from "../../hooks/use-inventory-edit-slot";

export type InventoryItemEditExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

function InventoryItemEditBound(props: UseInventoryEditSlotProps) {
  const { context, payload, ref, onChange } = useInventoryEditSlot(props);

  return (
    <InventoryItemEdit
      ref={ref}
      context={context}
      value={payload}
      onChange={onChange}
    />
  );
}

export default function InventoryItemEditExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.EDIT_INVENTORY,
  context,
  initialValue,
  onChange,
  registerHandle,
  platform,
  entryLink,
}: InventoryItemEditExposedProps) {
  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <InventoryItemEditBound
          groupId={groupId}
          slotId={slotId}
          context={context as InventoryEditContext | undefined}
          initialValue={initialValue as InventoryEditPayload | undefined}
          onChange={onChange as ((value: InventoryEditPayload) => void) | undefined}
          registerHandle={registerHandle}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
