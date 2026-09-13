import {
  PRODUCT_CONTRIBUTION_SLICES,
  type InventoryEditPayload,
  type InventoryPayload,
  type SlotContribution,
} from "@khinemyaezin/seller-contracts";

export function projectInventoryCreate(payload: InventoryPayload): SlotContribution[] {
  return [
    {
      slice: PRODUCT_CONTRIBUTION_SLICES.INVENTORY_LINES,
      append: payload.locations.map((location) => ({
        sku: payload.sku,
        locationId: location.locationId,
        initialQuantity: location.initialQuantity,
        safetyStock: location.safetyStock,
      })),
    },
  ];
}

export function projectInventoryEdit(payload: InventoryEditPayload): SlotContribution[] {
  const lines: unknown[] = [];

  for (const op of payload.ops) {
    if (op.op === "CREATE") {
      lines.push({
        sku: payload.sku,
        locationId: op.locationId,
        op: "CREATE",
        create: op.create,
      });
      continue;
    }

    lines.push({
      sku: payload.sku,
      inventoryItemId: op.inventoryItemId,
      op: "ADJUST",
      adjust: op.adjust,
    });
  }

  return [
    {
      slice: PRODUCT_CONTRIBUTION_SLICES.INVENTORY_LINES,
      append: lines,
    },
  ];
}
