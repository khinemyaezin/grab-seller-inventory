import type {
  InventoryCreateContext,
  InventoryPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InventoryCreateForm } from "../inventory/components/item/inventory-create-form";
import { InlineInventoryFields } from "../inventory/components/item/inline-inventory-fields";

export function InventoryCreateInlineSlot(
  props: SlotWidgetProps<InventoryCreateContext, InventoryPayload>,
) {
  return (
    <InventoryCreateForm
      context={props.context}
      defaultValues={props.initialValue}
      onValuesChange={props.onChange}
      registerHandle={props.registerHandle}
    >
      <InlineInventoryFields />
    </InventoryCreateForm>
  );
}
