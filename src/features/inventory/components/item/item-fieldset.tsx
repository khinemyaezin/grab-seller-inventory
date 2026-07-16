import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import type { ItemFormValues } from "@/features/inventory/types";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@khinemyaezin/seller-ui/components/field";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import ProductSearch from "../catalog/product-search";

export function ItemBasicFieldSet() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ItemFormValues>();
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
    active: true,
  });
  const locations = locationsData?._embedded?.locationResponseList ?? [];

  return (
    <>
      <FieldSet>
        <FieldLegend>Stock identity</FieldLegend>
        <FieldDescription>Link a catalog SKU to a fulfillment location.</FieldDescription>

        <FieldGroup className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.product}>
            <FieldLabel htmlFor="sku">SKU</FieldLabel>
            <Controller
              control={control}
              name="product"
              rules={{
                validate: (value) =>
                  value?.sku?.trim() ? true : "SKU is required",
              }}
              render={({ field }) => (
                <>
                  <ProductSearch
                    id="sku"
                    value={field.value?.sku ?? ""}
                    onChange={(sku) => {
                      field.onChange({ sku, productName: "" });
                    }}
                    aria-invalid={!!errors.product}
                    onSelectProduct={(value) => {
                      field.onChange(value ?? { sku: "", productName: "" });
                    }}
                  />
                  {field.value?.productName && (
                    <FieldDescription> {field.value.productName}</FieldDescription>
                  )}
                </>
              )}
            />
            {errors.product && (
              <p id="sku-error" className="text-sm text-destructive">
                {errors.product.message}
              </p>
            )}
          </Field>

          <Field data-invalid={!!errors.locationId}>
            <FieldLabel htmlFor="locationId">Location</FieldLabel>
            <Controller
              control={control}
              name="locationId"
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  aria-invalid={!!errors.locationId}
                >
                  <SelectTrigger className="w-full" id="locationId">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.code} — {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.locationId && (
              <p className="text-sm text-destructive">{errors.locationId.message}</p>
            )}
          </Field>

          <Field data-invalid={!!errors.initialQuantity}>
            <FieldLabel htmlFor="initialQuantity">Initial quantity</FieldLabel>
            <Input
              id="initialQuantity"
              type="number"
              min={0}
              aria-invalid={!!errors.initialQuantity}
              {...register("initialQuantity", {
                required: "Initial quantity is required",
                valueAsNumber: true,
                min: { value: 0, message: "Must be 0 or greater" },
              })}
            />
            {errors.initialQuantity && (
              <p className="text-sm text-destructive">{errors.initialQuantity.message}</p>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator className="my-6" />

      <FieldSet>
        <FieldLegend>Reorder settings</FieldLegend>
        <FieldDescription>Optional thresholds used for low-stock operations.</FieldDescription>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.safetyStock}>
            <FieldLabel htmlFor="safetyStock">Safety stock</FieldLabel>
            <Input
              id="safetyStock"
              type="number"
              min={0}
              {...register("safetyStock", { valueAsNumber: true, min: 0 })}
            />
          </Field>
          <Field data-invalid={!!errors.reorderPoint}>
            <FieldLabel htmlFor="reorderPoint">Reorder point</FieldLabel>
            <Input
              id="reorderPoint"
              type="number"
              min={0}
              {...register("reorderPoint", { valueAsNumber: true, min: 0 })}
            />
          </Field>
          <Field data-invalid={!!errors.reorderQuantity}>
            <FieldLabel htmlFor="reorderQuantity">Reorder quantity</FieldLabel>
            <Input
              id="reorderQuantity"
              type="number"
              min={0}
              {...register("reorderQuantity", { valueAsNumber: true, min: 0 })}
            />
          </Field>
          <Field data-invalid={!!errors.maxStock}>
            <FieldLabel htmlFor="maxStock">Max stock</FieldLabel>
            <Input
              id="maxStock"
              type="number"
              min={0}
              {...register("maxStock")}
              placeholder="Optional"
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
