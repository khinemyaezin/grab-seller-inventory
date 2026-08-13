import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import {
  InventoryPayload,
  InventoryPayloadSchema,
} from "@khinemyaezin/seller-contracts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Ref, useCallback, useEffect, useImperativeHandle } from "react";
import { useDebounce } from "@khinemyaezin/seller-ui";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import type { InventoryWidgetHandle } from "./product-inventory-widget-exposed";

export type ProductInventoryWidgetProps = {
  value?: Partial<InventoryPayload>;
  onChange: (value: InventoryPayload) => void;
  ref: Ref<InventoryWidgetHandle>;
};

const DEFAULT_VALUE: InventoryPayload = {
  sku: "",
  locationId: "",
  initialQuantity: 0,
  safetyStock: 0,
};

const schema = z.fromJSONSchema(InventoryPayloadSchema) as z.ZodType<
  InventoryPayload,
  InventoryPayload
>;

export default function ProductInventoryWidget({
  value,
  onChange,
  ref,
}: ProductInventoryWidgetProps) {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });
  const locations = locationsData?._embedded?.locationResponseList ?? [];

  const form = useForm<InventoryPayload>({
    defaultValues: DEFAULT_VALUE,
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { reset, register, watch, control, setValue, formState: { errors } } = form;
  const locationId = watch("locationId");
  const sku = watch("sku");

  useEffect(() => {
    if (value) {
      reset({ ...DEFAULT_VALUE, ...value });
    }
  }, [value]);

  useEffect(() => {
    if (locationId || locations.length === 0) return;
    setValue("locationId", locations[0].id, { shouldValidate: true, shouldDirty: true });
  }, [locationId, locations, setValue]);

  const emitChange = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onChange(form.getValues());
    }
  }, [form, onChange]);

  const { debounceFn: debouncedEmitChange } = useDebounce(emitChange, 300);

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name) {
        debouncedEmitChange();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedEmitChange]);

  useImperativeHandle(ref, () => {
    return {
      validate: async () => {
        const isValid = await form.trigger();
        if (isValid) {
          return { value: form.getValues() };
        }

        const formErrors: Record<string, string> = {};
        Object.entries(form.formState.errors).forEach(([key, err]) => {
          if (err?.message) {
            formErrors[key] = err.message as string;
          }
        });

        return { errors: formErrors };
      },
    };
  }, [form]);

  const fieldId = sku?.trim() || "line";

  return (
    <FieldGroup className="grid gap-4">
      <input type="hidden" {...register("sku")} />

      <Field data-invalid={!!errors.locationId}>
        <FieldLabel>Location</FieldLabel>
        <Controller
          control={control}
          name="locationId"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger aria-invalid={!!errors.locationId}>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2 text-center">
                    No locations available.
                  </div>
                ) : (
                  locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} {location.code ? `(${location.code})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.locationId ? (
          <FieldError errors={[errors.locationId]} />
        ) : null}
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field data-invalid={!!errors.initialQuantity}>
          <FieldLabel htmlFor={`inventory-${fieldId}-qty`}>
            Initial quantity
          </FieldLabel>
          <Input
            id={`inventory-${fieldId}-qty`}
            type="number"
            min={0}
            placeholder="0"
            aria-invalid={!!errors.initialQuantity}
            {...register("initialQuantity", { valueAsNumber: true })}
          />
          {errors.initialQuantity ? (
            <FieldError errors={[errors.initialQuantity]} />
          ) : null}
        </Field>

        <Field data-invalid={!!errors.safetyStock}>
          <FieldLabel htmlFor={`inventory-${fieldId}-safety`}>
            Safety stock
          </FieldLabel>
          <Input
            id={`inventory-${fieldId}-safety`}
            type="number"
            min={0}
            placeholder="0"
            aria-invalid={!!errors.safetyStock}
            {...register("safetyStock", { valueAsNumber: true })}
          />
          {errors.safetyStock ? (
            <FieldError errors={[errors.safetyStock]} />
          ) : null}
        </Field>
      </div>
    </FieldGroup>
  );
}
