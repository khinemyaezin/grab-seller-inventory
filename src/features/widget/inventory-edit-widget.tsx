import { PRODUCT_EXTENSION_SLOTS } from "@khinemyaezin/seller-contracts";
import { createExposedSlot } from "@khinemyaezin/seller-ui";
import { InventoryEditSlot } from "./inventory-edit-slot";

export default createExposedSlot({
  defaultSlotId: PRODUCT_EXTENSION_SLOTS.EDIT_INVENTORY,
  Widget: InventoryEditSlot,
});
