import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { InventoryPayload } from "@khinemyaezin/seller-contracts";
import { Field, FieldError } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";

export function InlineInventoryFields() {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });
  const locations = (locationsData?._embedded?.locationResponseList ?? []).filter(
    (location) => location.active,
  );

  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<InventoryPayload>();

  const hasInitializedLocations = useRef(false);
  useEffect(() => {
    if (hasInitializedLocations.current || !locations.length) return;
    const currentLocations = getValues("locations");
    if (!currentLocations || currentLocations.length === 0) {
      setValue("locations", [{
        locationId: locations[0].id,
        initialQuantity: 0,
        safetyStock: 0,
      }]);
      hasInitializedLocations.current = true;
    }
  }, [locations, getValues, setValue]);

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
