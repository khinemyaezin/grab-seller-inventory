import { PRODUCT_EXTENSION_SLOTS } from "@khinemyaezin/seller-contracts";
import { createExposedSlot } from "@khinemyaezin/seller-ui";
import { InventoryCreateSlot } from "./inventory-create-slot";

export default createExposedSlot({
  defaultSlotId: PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY,
  Widget: InventoryCreateSlot,
});
