import { PRODUCT_EXTENSION_SLOTS } from "@khinemyaezin/seller-contracts";
import { createExposedSlot } from "@khinemyaezin/seller-ui";
import { InventoryCreateInlineSlot } from "./inline-inventory-create-slot";

export default createExposedSlot({
  defaultSlotId: PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY_INLINE,
  Widget: InventoryCreateInlineSlot,
});
