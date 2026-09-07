import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { SlotHandle } from "@khinemyaezin/seller-contracts";
import useInventoryNewSlot, {
  type InventoryWidgetHandle,
  type UseInventoryNewSlotProps,
} from "./use-inventory-new-slot";

const SLOT_PROPS = {
  groupId: "group-1",
  slotId: "create-inventory",
} as const;

describe("useInventoryNewSlot", () => {
  it("calls onChange with widget drafts and ignores later initialValue", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      (props: UseInventoryNewSlotProps) => useInventoryNewSlot(props),
      {
        initialProps: {
          ...SLOT_PROPS,
          initialValue: { sku: "SKU-1", locations: [] },
          onChange,
        },
      },
    );

    expect(result.current.payload).toEqual({ sku: "SKU-1", locations: [] });

    const next = {
      sku: "SKU-1",
      locations: [{ locationId: "wh-1", initialQuantity: 4, safetyStock: 1 }],
    };

    act(() => {
      result.current.onChange(next);
    });

    expect(onChange).toHaveBeenCalledWith(next);
    expect(result.current.payload).toEqual(next);

    rerender({
      ...SLOT_PROPS,
      initialValue: { sku: "SKU-CHANGED", locations: [] },
      onChange,
    });

    expect(result.current.payload).toEqual(next);
  });

  it("merges live context sku into the draft and onChanges it", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      (props: UseInventoryNewSlotProps) => useInventoryNewSlot(props),
      {
        initialProps: {
          ...SLOT_PROPS,
          context: { sku: "SKU-1" },
          initialValue: { sku: "SKU-1", locations: [] },
          onChange,
        },
      },
    );

    expect(onChange).not.toHaveBeenCalled();

    rerender({
      ...SLOT_PROPS,
      context: { sku: "SKU-2" },
      initialValue: { sku: "SKU-1", locations: [] },
      onChange,
    });

    expect(result.current.payload?.sku).toBe("SKU-2");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ sku: "SKU-2", locations: [] }),
    );
  });

  it("registerHandle validate delegates to the widget ref without events", async () => {
    let handle: SlotHandle | undefined;
    const registerHandle = (next: SlotHandle) => {
      handle = next;
    };

    const { result } = renderHook(() =>
      useInventoryNewSlot({
        ...SLOT_PROPS,
        registerHandle,
      }),
    );

    expect(handle).toBeDefined();
    await expect(handle!.validate()).resolves.toEqual({ valid: false });

    const widget: InventoryWidgetHandle = {
      validate: vi.fn(async () => ({
        value: { sku: "SKU-1", locations: [] },
      })),
      getValues: () => ({ sku: "SKU-1", locations: [] }),
    };

    act(() => {
      result.current.ref.current = widget;
    });

    await expect(handle!.validate()).resolves.toEqual({
      valid: true,
      value: { sku: "SKU-1", locations: [] },
    });
    expect(widget.validate).toHaveBeenCalledTimes(1);
    expect(handle!.getValues()).toEqual({ sku: "SKU-1", locations: [] });
  });
});
