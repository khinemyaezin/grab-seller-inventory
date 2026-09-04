import { type Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type {
  InventoryEditAdjustStock,
  InventoryEditContext,
  InventoryEditCreateStock,
  InventoryEditOp,
  InventoryEditPayload,
} from "@khinemyaezin/seller-contracts";
import type { InventoryItemResponse } from "@/features/inventory/types";
import { useInventoryItemsForVariantId } from "@/features/inventory/hooks/use-inventory-items-for-variant-id";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import type { InventoryEditWidgetHandle } from "@/features/inventory/hooks/use-inventory-edit-slot";
import type { StockOperationSubmit } from "@/features/inventory/components/stock-operations";
import type { InventoryItemEditForm, InventoryItemEditRow } from "../types/inventory.form";
import {
  EMPTY_INVENTORY_ITEMS,
  EMPTY_LOCATIONS,
  reconcileEditForm,
  rowsFromSelection,
  seedEditForm,
  toEditPayload,
} from "./inventory-edit-form";

const LOCATIONS_QUERY = { page: 0, size: 100 };

export type UseInventoryEditControllerOptions = {
  context?: InventoryEditContext;
  value?: InventoryEditPayload;
  onChange?: (value: InventoryEditPayload) => void;
  onConfirm?: (item: InventoryItemResponse | undefined, payload: StockOperationSubmit) => Promise<void>;
  ref?: Ref<InventoryEditWidgetHandle>;
};

export function useInventoryEdit({
  context,
  value,
  onChange,
  onConfirm,
  ref,
}: UseInventoryEditControllerOptions) {
  const variantId = context?.variantId?.trim();
  const sku = context?.sku;
  const itemsQuery = useInventoryItemsForVariantId(variantId);
  const items = itemsQuery.data ?? EMPTY_INVENTORY_ITEMS;
  const itemsLoading = Boolean(variantId) && itemsQuery.isLoading;

  const searchLocationLink = useInventoryLink("searchLocation");
  const locationsQuery = useLocations(searchLocationLink, LOCATIONS_QUERY);
  const locations = useMemo(() => {
    const list = locationsQuery.data?._embedded?.locationResponseList;
    if (!list?.length) return EMPTY_LOCATIONS;
    return list.filter((location) => location.active);
  }, [locationsQuery.data]);
  const locationsLoading = Boolean(searchLocationLink) && locationsQuery.isLoading;
  const locationsFetched = Boolean(searchLocationLink) && locationsQuery.isFetched;

  const isLoading = !variantId || !locationsFetched || itemsLoading || locationsLoading;
  const catalogReady = Boolean(variantId) && locationsFetched && !itemsLoading && !locationsLoading;
  const createOnly = catalogReady && items.length === 0;

  const [formValue, setFormValue] = useState<InventoryItemEditForm>();
  const formValueRef = useRef(formValue);
  formValueRef.current = formValue;
  const seededVariantIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!catalogReady || !variantId) return;

    if (seededVariantIdRef.current !== variantId) {
      seededVariantIdRef.current = variantId;
      setFormValue(
        seedEditForm({
          sku,
          variantId,
          locations,
          items,
          payload: value,
        }),
      );
      return;
    }

    setFormValue((prev) => {
      if (!prev) return prev;
      const reconciled = reconcileEditForm({
        prev,
        sku,
        variantId,
        locations,
        items,
      });
      const hasLocalOps = reconciled.items.some((row) => row.operation);
      if (value?.ops.length && !hasLocalOps) {
        return seedEditForm({
          sku,
          variantId,
          locations,
          items,
          payload: value,
        });
      }
      return reconciled;
    });
  }, [catalogReady, variantId, sku, locations, items, value]);

  const getPayload = useCallback(
    (): InventoryEditPayload => toEditPayload(formValueRef.current, sku, variantId),
    [sku, variantId],
  );

  const applyLocationSelection = useCallback(
    (selectedIds: string[]) => {
      if (selectedIds.length === 0) return;

      const next: InventoryItemEditForm = {
        sku,
        variantId,
        items: rowsFromSelection({
          selectedIds,
          locations,
          items,
          prev: formValueRef.current,
        }),
      };
      setFormValue(next);
      onChange?.(toEditPayload(next, sku, variantId));
    },
    [sku, variantId, locations, items, onChange],
  );

  const confirmForItem = useCallback(
    (locationId: string) => {
      return async (payload: StockOperationSubmit) => {
        const existingItem = items.find((item) => item.locationId === locationId);
        if (onConfirm) {
          await onConfirm(existingItem, payload);
        }

        const prev = formValueRef.current;
        if (!prev) return;

        const nextItems = prev.items.map((row): InventoryItemEditRow => {
          if (row.locationId !== locationId) return row;

          if (payload.op === "CREATE") {
            const createStock: InventoryEditCreateStock = {
              initialQuantity: payload.value.initialQuantity,
              safetyStock: payload.value.safetyStock,
              reorderPoint: payload.value.reorderPoint,
              reorderQuantity: payload.value.reorderQuantity,
              maxStock:
                payload.value.maxStock === ""
                  ? undefined
                  : Number(payload.value.maxStock),
            };
            const op: InventoryEditOp = {
              op: "CREATE",
              locationId: row.locationId,
              create: createStock,
            };

            return {
              op: "CREATE",
              locationId: row.locationId,
              locationName: row.locationName,
              inventoryItemId: row.inventoryItemId,
              onHandBefore: row.onHandBefore,
              available: row.available,
              onHand: payload.value.initialQuantity,
              createValues: payload.value,
              operation: op,
            };
          }

          const adjustStock: InventoryEditAdjustStock = {
            newOnHandQuantity: payload.value.newOnHandQuantity,
            reason: payload.value.reason,
          };
          const op: InventoryEditOp = {
            op: "ADJUST",
            inventoryItemId: row.inventoryItemId ?? existingItem?.id ?? "",
            adjust: adjustStock,
          };

          return {
            op: "ADJUST",
            locationId: row.locationId,
            locationName: row.locationName,
            inventoryItemId: row.inventoryItemId ?? existingItem?.id ?? "",
            onHandBefore: row.onHandBefore,
            available: row.available,
            onHand: payload.value.newOnHandQuantity,
            adjustValues: payload.value,
            operation: op,
          };
        });

        const nextValue: InventoryItemEditForm = { ...prev, items: nextItems };
        setFormValue(nextValue);
        onChange?.(toEditPayload(nextValue, sku, variantId));
      };
    },
    [items, onConfirm, sku, variantId, onChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      validate: async () => {
        return { value: getPayload() };
      },
      getValues: () => getPayload(),
    }),
    [getPayload],
  );

  return {
    formValue,
    isLoading,
    locations,
    createOnly,
    confirmForItem,
    applyLocationSelection,
  };
}
