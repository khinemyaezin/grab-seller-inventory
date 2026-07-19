import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { RadioGroup, RadioGroupItem } from "@khinemyaezin/seller-ui/components/radio-group";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemActions,
  ItemMedia,
} from "@khinemyaezin/seller-ui/components/item";
import type { ItemFormValues } from "@/features/inventory/types";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@khinemyaezin/seller-ui/components/field";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import CatalogVariantPicker, { CatalogVariantPickerEvent } from "../catalog/catalog-variant-picker";
import { ChevronRightIcon, MapPin } from "lucide-react";

type ItemStepFieldSetProps = {
  onSelected?: () => void;
};

export function ItemLocationFieldSet({ onSelected }: ItemStepFieldSetProps = {}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ItemFormValues>();
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });
  const locations = locationsData?._embedded?.locationResponseList ?? [];

  return (
    <FieldGroup className="grid grid-cols-1 gap-4">
      <Field data-invalid={!!errors.locationId}>
        <Controller
          control={control}
          name="locationId"
          rules={{ required: "Location is required" }}
          render={({ field }) => {
            const selectLocation = (value: string) => {
              if (value !== field.value) {
                field.onChange(value);
                setValue("product", { sku: "", productName: "" });
                setValue("productVariantId", "");
              }
              onSelected?.();
            };

            return (
              <RadioGroup
                id="locationId"
                value={field.value}
                onValueChange={selectLocation}
                aria-invalid={!!errors.locationId}
              >
                <ItemGroup>
                  {locations.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-2 text-center border border-transparent rounded-md">
                      No locations available.
                    </div>
                  ) : (
                    locations.map((location) => {
                      const isSelected = field.value === location.id;
                      return (
                        <Item asChild variant={isSelected ? "outline" : "default"} key={location.id}>
                          <FieldLabel
                            className="cursor-pointer hover:bg-muted/50 hover:border-border transition-colors"
                            onClick={() => {
                              if (isSelected) selectLocation(location.id);
                            }}
                          >
                            <ItemMedia variant="image" className="bg-secondary">
                              <MapPin className="h-5 w-5 text-muted-foreground" />
                            </ItemMedia>
                            <ItemContent className="grid grid-cols-2">
                              <div>
                                <ItemTitle>{location.name}</ItemTitle>
                                <ItemDescription>
                                  {[location.address?.city, location.address?.country]
                                    .filter(Boolean)
                                    .join(", ")}
                                </ItemDescription>
                              </div>
                              <div className="flex items-center justify-center">
                                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">
                                  {location.code}
                                </span>
                              </div>
                            </ItemContent>
                            <ItemActions>
                              <ChevronRightIcon className="size-4" />
                            </ItemActions>
                            <RadioGroupItem value={location.id} id={`location-${location.id}`} hidden />
                          </FieldLabel>
                        </Item>
                      );
                    })
                  )}
                </ItemGroup>
              </RadioGroup>
            );
          }}
        />
        {errors.locationId && (
          <p className="text-sm text-destructive">{errors.locationId.message}</p>
        )}
      </Field>
    </FieldGroup>
  );
}

export function ItemProductVariantFieldSet({ onSelected }: { onSelected: (inventoryId?: string) => void }) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ItemFormValues>();
  const locationId = watch("locationId");
  const selectedVariantId = watch("productVariantId");

  return (
    <FieldGroup>
      <Field data-invalid={!!errors.product}>
        <Controller
          control={control}
          name="product"
          rules={{
            validate: (value) =>
              value?.sku?.trim() ? true : "Product variant is required",
          }}
          render={({ field }) => (
            <>
              <CatalogVariantPicker
                locationId={locationId}
                selectedVariantId={selectedVariantId}
                onSelect={(event: CatalogVariantPickerEvent) => {
                  if (event.inventory) {
                    onSelected(event.inventory.id);
                    return;
                  }
                  
                  if (event.product.sku !== field.value.sku) {
                    field.onChange({
                      sku: event.product.sku,
                      productName: event.product.name,
                    });
                    setValue("productVariantId", event.product.id, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }

                  onSelected?.();
                }}
              />
              {field.value?.sku && (
                <FieldDescription>
                  Selected {field.value.productName} ({field.value.sku})
                </FieldDescription>
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
    </FieldGroup>
  );
}

export function ItemStockSettingsFieldSet() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ItemFormValues>();

  return (
    <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
  );
}
