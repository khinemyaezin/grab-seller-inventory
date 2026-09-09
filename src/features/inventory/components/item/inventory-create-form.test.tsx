import { describe, expect, it, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { InventoryPayload, SlotHandle } from "@khinemyaezin/seller-contracts";
import { InventoryCreateForm } from "./inventory-create-form";
import { InventoryFields } from "./inventory-fields";

vi.mock("@/features/inventory/hooks/use-root", () => ({
  useInventoryLink: () => ({ href: "http://example.com/locations" }),
}));

vi.mock("@/features/inventory/hooks/use-locations", () => ({
  useLocations: () => ({
    data: {
      _embedded: {
        locationResponseList: [
          { id: "wh-1", name: "Warehouse 1", active: true },
        ],
      },
    },
  }),
}));

const INITIAL: InventoryPayload = {
  sku: "SKU-1",
  locations: [{ locationId: "wh-1", initialQuantity: 10, safetyStock: 1 }],
};

describe("InventoryCreateForm", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("keeps live form values when later defaultValues change", () => {
    let handle: SlotHandle<InventoryPayload> | undefined;
    const { rerender } = render(
      <InventoryCreateForm
        defaultValues={INITIAL}
        registerHandle={(next) => {
          handle = next;
        }}
      >
        <InventoryFields />
      </InventoryCreateForm>,
    );

    const quantity = screen.getByLabelText("initial quantity");
    fireEvent.change(quantity, { target: { value: "20" } });

    expect(handle?.getValues().locations[0]?.initialQuantity).toBe(20);

    rerender(
      <InventoryCreateForm
        defaultValues={{
          sku: "SKU-CHANGED",
          locations: [{ locationId: "wh-1", initialQuantity: 99, safetyStock: 0 }],
        }}
        registerHandle={(next) => {
          handle = next;
        }}
      >
        <InventoryFields />
      </InventoryCreateForm>,
    );

    expect(handle?.getValues()).toEqual({
      sku: "SKU-1",
      locations: [{ locationId: "wh-1", initialQuantity: 20, safetyStock: 1 }],
    });
    expect(quantity).toHaveValue(20);
  });

  it("emits after context sku is written onto the form", () => {
    vi.useFakeTimers();
    const onValuesChange = vi.fn();

    const { rerender } = render(
      <InventoryCreateForm
        context={{ sku: "SKU-1" }}
        defaultValues={INITIAL}
        onValuesChange={onValuesChange}
      >
        <InventoryFields />
      </InventoryCreateForm>,
    );

    expect(onValuesChange).not.toHaveBeenCalled();

    rerender(
      <InventoryCreateForm
        context={{ sku: "SKU-2" }}
        defaultValues={INITIAL}
        onValuesChange={onValuesChange}
      >
        <InventoryFields />
      </InventoryCreateForm>,
    );

    expect(onValuesChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onValuesChange).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenCalledWith(
      expect.objectContaining({ sku: "SKU-2", locations: INITIAL.locations }),
    );
  });

  it("reset restores mounted values and keeps the current sku", () => {
    let handle: SlotHandle<InventoryPayload> | undefined;
    const registerHandle = (next: SlotHandle<InventoryPayload>) => {
      handle = next;
    };

    const { rerender } = render(
      <InventoryCreateForm
        context={{ sku: "SKU-1" }}
        defaultValues={INITIAL}
        registerHandle={registerHandle}
      >
        <InventoryFields />
      </InventoryCreateForm>,
    );

    fireEvent.change(screen.getByLabelText("initial quantity"), {
      target: { value: "50" },
    });

    rerender(
      <InventoryCreateForm
        context={{ sku: "SKU-2" }}
        defaultValues={INITIAL}
        registerHandle={registerHandle}
      >
        <InventoryFields />
      </InventoryCreateForm>,
    );

    expect(handle?.getValues().sku).toBe("SKU-2");

    act(() => {
      handle?.reset?.();
    });

    expect(handle?.getValues()).toEqual({
      sku: "SKU-2",
      locations: [{ locationId: "wh-1", initialQuantity: 10, safetyStock: 1 }],
    });
  });
});
