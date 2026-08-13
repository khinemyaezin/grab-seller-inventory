import {
  Field,
  FieldError,
} from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  InventoryPayload,
  InventoryPayloadSchema,
} from "@khinemyaezin/seller-contracts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Ref, useCallback, useEffect, useImperativeHandle } from "react";
import { useDebounce } from "@khinemyaezin/seller-ui";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import type { InlineInventoryWidgetHandle } from "./inline-inventory-widget-exposed";

export type InlineInventoryWidgetProps = {
  value?: Partial<InventoryPayload>;
  onChange: (value: InventoryPayload) => void;
  ref: Ref<InlineInventoryWidgetHandle>;
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

export default function InlineInventoryWidget({
  value,
  onChange,
  ref,
}: InlineInventoryWidgetProps) {
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
  const { reset, register, watch, setValue, formState: { errors } } = form;
  const locationId = watch("locationId");

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

  return (
    <Field data-invalid={!!errors.initialQuantity} className="gap-1">
      <input type="hidden" {...register("sku")} />
      <input type="hidden" {...register("locationId")} />
      <input type="hidden" {...register("safetyStock", { valueAsNumber: true })} />
      <Input
        id="inline-inventory-qty"
        type="number"
        min={0}
        placeholder="0"
        aria-label="Initial quantity"
        aria-invalid={!!errors.initialQuantity}
        {...register("initialQuantity", { valueAsNumber: true })}
      />
      {errors.initialQuantity ? (
        <FieldError errors={[errors.initialQuantity]} />
      ) : null}
    </Field>
  );
}
