import {
  InventoryEditContext,
  InventoryEditPayload,
  type SlotHandle,
} from "@khinemyaezin/seller-contracts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  mergeFromHydrate,
  useRegisterSlotHandle,
  type SlotWidgetHandle,
} from "@khinemyaezin/seller-ui";

export type InventoryEditWidgetHandle = SlotWidgetHandle<InventoryEditPayload>;

export type UseInventoryEditSlotProps = {
  groupId: string;
  slotId: string;
  context?: InventoryEditContext;
  initialValue?: InventoryEditPayload;
  onChange?: (value: InventoryEditPayload) => void;
  registerHandle?: (handle: SlotHandle<InventoryEditPayload>) => void | (() => void);
};

export default function useInventoryEditSlot({
  context,
  initialValue,
  onChange,
  registerHandle,
}: UseInventoryEditSlotProps) {
  const ref = useRef<InventoryEditWidgetHandle>(null);
  const [payload, setPayload] = useState<InventoryEditPayload | undefined>(initialValue);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useRegisterSlotHandle(ref, registerHandle);

  const sku = context?.sku;
  const variantId = context?.variantId;

  useEffect(() => {
    if (sku === undefined && variantId === undefined) return;
    const prev = payloadRef.current;
    if (
      prev &&
      prev.sku === (sku ?? "") &&
      prev.variantId === variantId
    ) {
      return;
    }

    const next = mergeFromHydrate(prev, ref.current?.getValues(), {
      ...(sku !== undefined ? { sku } : {}),
      ...(variantId !== undefined ? { variantId } : {}),
    });
    payloadRef.current = next;
    setPayload(next);
    onChangeRef.current?.(next);
  }, [sku, variantId]);

  const handleChange = useCallback((next: InventoryEditPayload) => {
    payloadRef.current = next;
    setPayload(next);
    onChangeRef.current?.(next);
  }, []);

  return { context, payload, ref, onChange: handleChange };
}
