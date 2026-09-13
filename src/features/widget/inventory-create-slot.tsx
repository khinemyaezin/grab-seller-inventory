import type {
  InventoryCreateContext,
  InventoryPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InventoryCreateFormContext } from "../inventory/components/item/item-popover-create-form-context";
import { ItemPopoverFields } from "../inventory/components/item/item-popover-fields";
import { ItemInlinePopoverFields } from "../inventory/components/item/item-inline-popover-fields";

export function InventoryCreateSlot(
  props: SlotWidgetProps<InventoryCreateContext, InventoryPayload>,
) {
  const Fields = props.variant === "inline" ? ItemInlinePopoverFields : ItemPopoverFields;
  return (
    <InventoryCreateFormContext
      {...props}
      loadingFallback={
        props.variant === "inline" ? (
          <span className="text-sm text-muted-foreground">…</span>
        ) : undefined
      }
    >
      <Fields />
    </InventoryCreateFormContext>
  );
}
