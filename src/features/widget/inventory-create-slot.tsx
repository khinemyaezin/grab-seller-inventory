import type {
  InventoryCreateContext,
  InventoryPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InventoryCreateForm } from "../inventory/components/item/inventory-create-form";
import { InventoryFields } from "../inventory/components/item/inventory-fields";

export function InventoryCreateSlot(
  props: SlotWidgetProps<InventoryCreateContext, InventoryPayload>,
) {
  return (
    <InventoryCreateForm
      context={props.context}
      defaultValues={props.initialValue}
      onValuesChange={props.onChange}
      registerHandle={props.registerHandle}
    >
      <InventoryFields />
    </InventoryCreateForm>
  );
}
