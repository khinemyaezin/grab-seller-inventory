import { useFormContext } from "react-hook-form";
import type { InventoryPayload } from "@khinemyaezin/seller-contracts";
import { Field, FieldError } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { useInventoryCreateLocations } from "./item-popover-create-form-context";

export function ItemInlinePopoverFields() {
  const { locations } = useInventoryCreateLocations();

  const {
    register,
    formState: { errors },
  } = useFormContext<InventoryPayload>();

  if (locations.length === 0) {
    return null;
  }

  if (locations.length > 1) {
    return (
      <Field className="gap-1">
        <input type="hidden" {...register("sku")} />
        <span className="text-sm">0</span>
      </Field>
    );
  }

  const quantityError = errors.locations?.[0]?.initialQuantity;

  return (
    <Field data-invalid={!!quantityError} className="gap-1">
      <input type="hidden" {...register("sku")} />
      <input type="hidden" {...register("locations.0.locationId")} />
      <input
        type="hidden"
        {...register("locations.0.safetyStock", { valueAsNumber: true })}
      />
      <Input
        id="inline-inventory-qty"
        type="number"
        min={0}
        placeholder="0"
        aria-label="Initial quantity"
        aria-invalid={!!quantityError}
        {...register("locations.0.initialQuantity", { valueAsNumber: true })}
      />
      {quantityError ? <FieldError errors={[quantityError]} /> : null}
    </Field>
  );
}
