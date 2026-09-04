import type {
  InventoryEditOp,
  InventoryEditPayload,
} from "@khinemyaezin/seller-contracts";
import type {
  CreateInventoryItemValues,
  InventoryItemEditForm,
  InventoryItemEditRow,
} from "../types/inventory.form";
import type { InventoryItemResponse, LocationResponse } from "../types";

export const EMPTY_INVENTORY_ITEMS: InventoryItemResponse[] = [];
export const EMPTY_LOCATIONS: LocationResponse[] = [];

function defaultCreateValues(locationId: string): CreateInventoryItemValues {
  return {
    locationId,
    initialQuantity: 0,
    safetyStock: 0,
    reorderPoint: 0,
    reorderQuantity: 0,
    maxStock: "",
  };
}

function createOpFromValues(
  locationId: string,
  values: CreateInventoryItemValues,
): Extract<InventoryEditOp, { op: "CREATE" }> {
  return {
    op: "CREATE",
    locationId,
    create: {
      initialQuantity: values.initialQuantity,
      safetyStock: values.safetyStock,
      reorderPoint: values.reorderPoint,
      reorderQuantity: values.reorderQuantity,
      maxStock:
        values.maxStock === "" || values.maxStock == null
          ? undefined
          : Number(values.maxStock),
    },
  };
}

export function createRow(
  location: LocationResponse,
  prev?: InventoryItemEditRow,
  commit = false,
): Extract<InventoryItemEditRow, { op: "CREATE" }> {
  if (prev?.op === "CREATE") {
    const next = {
      ...prev,
      locationName: location.name,
    };
    if (commit && !next.operation && next.createValues) {
      return {
        ...next,
        operation: createOpFromValues(location.id, next.createValues),
      };
    }
    return next;
  }

  const createValues = defaultCreateValues(location.id);
  return {
    op: "CREATE",
    locationId: location.id,
    locationName: location.name,
    onHandBefore: 0,
    onHand: 0,
    available: 0,
    createValues,
    ...(commit ? { operation: createOpFromValues(location.id, createValues) } : {}),
  };
}

export function adjustRow(
  location: LocationResponse,
  inventory: InventoryItemResponse,
  prev?: InventoryItemEditRow,
): Extract<InventoryItemEditRow, { op: "ADJUST" }> {
  if (prev?.op === "ADJUST" && prev.inventoryItemId === inventory.id) {
    return {
      ...prev,
      locationName: location.name,
      onHandBefore: inventory.onHand,
      available: inventory.available,
      onHand: prev.operation ? prev.onHand : inventory.onHand,
      adjustValues: prev.operation
        ? prev.adjustValues
        : {
            newOnHandQuantity: inventory.onHand,
            reason: "CORRECTION",
          },
    };
  }

  return {
    op: "ADJUST",
    locationId: location.id,
    locationName: location.name,
    inventoryItemId: inventory.id,
    onHandBefore: inventory.onHand,
    onHand: inventory.onHand,
    available: inventory.available,
    adjustValues: {
      newOnHandQuantity: inventory.onHand,
      reason: "CORRECTION",
    },
  };
}

export function opsByLocationId(
  ops: InventoryEditOp[] | undefined,
  items: InventoryItemResponse[],
): Map<string, InventoryEditOp> {
  const map = new Map<string, InventoryEditOp>();
  if (!ops) return map;

  for (const op of ops) {
    if (op.op === "CREATE") {
      map.set(op.locationId, op);
      continue;
    }
    const item = items.find((inventory) => inventory.id === op.inventoryItemId);
    if (item) map.set(item.locationId, op);
  }

  return map;
}

function overlayOp(
  row: InventoryItemEditRow,
  op: InventoryEditOp | undefined,
): InventoryItemEditRow {
  if (!op) return row;

  if (op.op === "CREATE" && row.op === "CREATE") {
    const createValues: CreateInventoryItemValues = {
      locationId: row.locationId,
      initialQuantity: op.create.initialQuantity,
      safetyStock: op.create.safetyStock ?? 0,
      reorderPoint: op.create.reorderPoint ?? 0,
      reorderQuantity: op.create.reorderQuantity ?? 0,
      maxStock: op.create.maxStock ?? "",
    };
    return {
      ...row,
      onHand: op.create.initialQuantity,
      createValues,
      operation: op,
    };
  }

  if (op.op === "ADJUST" && row.op === "ADJUST") {
    return {
      ...row,
      onHand: op.adjust.newOnHandQuantity,
      adjustValues: {
        newOnHandQuantity: op.adjust.newOnHandQuantity,
        reason: op.adjust.reason,
      },
      operation: op,
    };
  }

  return row;
}

function catalogRow(
  location: LocationResponse,
  inventory: InventoryItemResponse | undefined,
  prev?: InventoryItemEditRow,
  commitCreate = false,
): InventoryItemEditRow {
  return inventory
    ? adjustRow(location, inventory, prev)
    : createRow(location, prev, commitCreate);
}

export function toEditPayload(
  form: InventoryItemEditForm | undefined,
  sku?: string,
  variantId?: string,
): InventoryEditPayload {
  return {
    sku: sku ?? form?.sku ?? "",
    variantId: variantId ?? form?.variantId,
    ops: (form?.items ?? []).flatMap((row): InventoryEditOp[] =>
      row.operation ? [row.operation] : [],
    ),
  };
}

export function seedEditForm(args: {
  sku?: string;
  variantId?: string;
  locations: LocationResponse[];
  items: InventoryItemResponse[];
  payload?: InventoryEditPayload;
}): InventoryItemEditForm {
  const { sku, variantId, locations, items, payload } = args;
  const itemByLocation = new Map(items.map((item) => [item.locationId, item]));
  const opByLocation = opsByLocationId(payload?.ops, items);

  return {
    sku,
    variantId,
    items: locations.map((location) => {
      const row = catalogRow(location, itemByLocation.get(location.id));
      return overlayOp(row, opByLocation.get(location.id));
    }),
  };
}

export function reconcileEditForm(args: {
  prev: InventoryItemEditForm;
  sku?: string;
  variantId?: string;
  locations: LocationResponse[];
  items: InventoryItemResponse[];
}): InventoryItemEditForm {
  const { prev, sku, variantId, locations, items } = args;
  const locationById = new Map(locations.map((location) => [location.id, location]));
  const itemByLocation = new Map(items.map((item) => [item.locationId, item]));

  return {
    sku,
    variantId,
    items: prev.items.flatMap((row) => {
      const location = locationById.get(row.locationId);
      if (!location) return [];
      return [catalogRow(location, itemByLocation.get(row.locationId), row)];
    }),
  };
}

export function rowsFromSelection(args: {
  selectedIds: string[];
  locations: LocationResponse[];
  items: InventoryItemResponse[];
  prev?: InventoryItemEditForm;
}): InventoryItemEditRow[] {
  const { selectedIds, locations, items, prev } = args;
  const prevById = new Map((prev?.items ?? []).map((row) => [row.locationId, row]));
  const itemByLocation = new Map(items.map((item) => [item.locationId, item]));

  return locations
    .filter((location) => selectedIds.includes(location.id))
    .map((location) =>
      catalogRow(
        location,
        itemByLocation.get(location.id),
        prevById.get(location.id),
        true,
      ),
    );
}
