import type {
  InventoryEditContext,
  InventoryEditPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import InventoryItemEdit from "../inventory/components/item/inventory-item-edit";

export function InventoryEditSlot(
  props: SlotWidgetProps<InventoryEditContext, InventoryEditPayload>,
) {
  return (
    <InventoryItemEdit
      context={props.context}
      value={props.initialValue}
      onChange={props.onChange}
      registerHandle={props.registerHandle}
    />
  );
}
