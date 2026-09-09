import type {
  InventoryEditContext,
  InventoryEditPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import ItemPopoverEditForm from "../inventory/components/item/item-popover-edit-form";

export function InventoryEditSlot(
  props: SlotWidgetProps<InventoryEditContext, InventoryEditPayload>,
) {
  return (
    <ItemPopoverEditForm
      context={props.context}
      value={props.initialValue}
      onChange={props.onChange}
      registerHandle={props.registerHandle}
    />
  );
}
