import type {
  InventoryCreateContext,
  InventoryPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InventoryCreateFormContext } from "../inventory/components/item/item-popover-create-form-context";
import { ItemPopoverFields } from "../inventory/components/item/item-popover-fields";

export function InventoryCreateSlot(
  props: SlotWidgetProps<InventoryCreateContext, InventoryPayload>,
) {
  return (
    <InventoryCreateFormContext {...props}>
      <ItemPopoverFields />
    </InventoryCreateFormContext>
  );
}
