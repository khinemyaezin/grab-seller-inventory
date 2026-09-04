import { describe, it, expect } from "vitest";
import type { InventoryItemResponse, LocationResponse } from "../types";
import {
  reconcileEditForm,
  rowsFromSelection,
  seedEditForm,
  toEditPayload,
} from "./inventory-edit-form";

function location(id: string, name = id): LocationResponse {
  return { id, name } as LocationResponse;
}

function item(id: string, locationId: string, onHand = 4): InventoryItemResponse {
  return { id, locationId, onHand, available: onHand } as InventoryItemResponse;
}

describe("inventory-edit-form", () => {
  const warehouse = location("wh-1", "Warehouse");
  const store = location("st-1", "Store");

  it("seeds every location until the user narrows the selection", () => {
    const form = seedEditForm({
      sku: "SKU-1",
      variantId: "var-1",
      locations: [warehouse, store],
      items: [item("inv-1", "wh-1", 8)],
    });

    expect(form.items.map((row) => row.locationId)).toEqual(["wh-1", "st-1"]);
    expect(form.items.map((row) => row.op)).toEqual(["ADJUST", "CREATE"]);
    expect(toEditPayload(form).ops).toEqual([]);
  });

  it("overlays CREATE ops from the event payload onto locations without stock", () => {
    const form = seedEditForm({
      sku: "SKU-1",
      variantId: "var-1",
      locations: [warehouse, store],
      items: [item("inv-1", "wh-1", 8)],
      payload: {
        sku: "SKU-1",
        variantId: "var-1",
        ops: [{ op: "CREATE", locationId: "st-1", create: { initialQuantity: 2 } }],
      },
    });

    expect(form.items.map((row) => row.locationId)).toEqual(["wh-1", "st-1"]);
    expect(form.items[1]?.op).toBe("CREATE");
    expect(toEditPayload(form).ops).toEqual([
      { op: "CREATE", locationId: "st-1", create: { initialQuantity: 2 } },
    ]);
  });

  it("narrowing locations commits CREATE for selected empty stock and keeps ADJUST rows", () => {
    const prev = seedEditForm({
      sku: "SKU-1",
      variantId: "var-1",
      locations: [warehouse, store],
      items: [item("inv-1", "wh-1", 8)],
    });

    const selected = rowsFromSelection({
      selectedIds: ["st-1"],
      locations: [warehouse, store],
      items: [item("inv-1", "wh-1", 8)],
      prev,
    });

    const payload = toEditPayload({ sku: "SKU-1", variantId: "var-1", items: selected });
    expect(selected.map((row) => row.locationId)).toEqual(["st-1"]);
    expect(selected[0]?.op).toBe("CREATE");
    expect(payload.ops).toEqual([
      expect.objectContaining({ op: "CREATE", locationId: "st-1" }),
    ]);
  });

  it("reconcile keeps local CREATE ops when the catalog refetches", () => {
    const prev = {
      sku: "SKU-1",
      variantId: "var-1",
      items: rowsFromSelection({
        selectedIds: ["st-1"],
        locations: [warehouse, store],
        items: [],
      }),
    };

    const next = reconcileEditForm({
      prev,
      sku: "SKU-1",
      variantId: "var-1",
      locations: [warehouse, store],
      items: [],
    });

    expect(next.items).toHaveLength(1);
    expect(next.items[0]?.op).toBe("CREATE");
    expect(next.items[0]?.operation).toBeDefined();
  });
});
