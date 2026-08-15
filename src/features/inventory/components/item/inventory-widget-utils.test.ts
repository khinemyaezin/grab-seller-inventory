import { describe, it, expect } from "vitest";
import { collectFormErrors } from "./inventory-widget-utils";
import type { FieldErrors } from "react-hook-form";

describe("collectFormErrors", () => {
  it("returns empty object when errors is empty or undefined", () => {
    expect(collectFormErrors(undefined)).toEqual({});
    expect(collectFormErrors({})).toEqual({});
  });

  it("handles flat top-level field errors", () => {
    const errors: FieldErrors = {
      sku: {
        type: "required",
        message: "SKU is required",
      },
    };

    expect(collectFormErrors(errors)).toEqual({
      sku: "SKU is required",
    });
  });

  it("handles nested array field errors like locations", () => {
    const errors: FieldErrors = {
      locations: [
        {
          initialQuantity: {
            type: "min",
            message: "Initial quantity must be 0 or greater",
          },
        },
        undefined as any,
        {
          safetyStock: {
            type: "min",
            message: "Safety stock must be 0 or greater",
          },
        },
      ] as any,
    };

    expect(collectFormErrors(errors)).toEqual({
      "locations.0.initialQuantity": "Initial quantity must be 0 or greater",
      "locations.2.safetyStock": "Safety stock must be 0 or greater",
    });
  });

  it("handles root errors on array fields", () => {
    const errors: FieldErrors = {
      locations: {
        root: {
          type: "min",
          message: "At least one location is required",
        },
      } as any,
    };

    expect(collectFormErrors(errors)).toEqual({
      locations: "At least one location is required",
    });
  });

  it("handles deeply nested object errors", () => {
    const errors: FieldErrors = {
      metadata: {
        warehouse: {
          code: {
            type: "required",
            message: "Warehouse code is required",
          },
        },
      } as any,
    };

    expect(collectFormErrors(errors)).toEqual({
      "metadata.warehouse.code": "Warehouse code is required",
    });
  });

  it("ignores non-error fields like ref and types", () => {
    const errors: FieldErrors = {
      sku: {
        type: "required",
        message: "SKU is required",
        ref: { name: "sku" } as any,
        types: { required: "SKU is required" } as any,
      },
    };

    expect(collectFormErrors(errors)).toEqual({
      sku: "SKU is required",
    });
  });
});
