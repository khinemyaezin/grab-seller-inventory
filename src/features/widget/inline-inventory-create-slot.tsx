import type {
  InventoryCreateContext,
  InventoryPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { InventoryCreateFormContext } from "../inventory/components/item/item-popover-create-form-context";
import { ItemInlinePopoverFields } from "../inventory/components/item/item-inline-popover-fields";

export function InventoryCreateInlineSlot(
  props: SlotWidgetProps<InventoryCreateContext, InventoryPayload>,
) {
  return (
    <InventoryCreateFormContext
      {...props}
      loadingFallback={
        <span className="text-sm text-muted-foreground">…</span>
      }
    >
      <ItemInlinePopoverFields />
    </InventoryCreateFormContext>
  );
}
