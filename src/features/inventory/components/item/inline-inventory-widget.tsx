import {
  Field,
  FieldError,
} from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  InventoryCreateContext,
  InventoryPayload,
  InventoryPayloadSchema,
} from "@khinemyaezin/seller-contracts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Ref, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useDebounce } from "@khinemyaezin/seller-ui";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import { collectFormErrors } from "./inventory-widget-utils";
import { InventoryWidgetHandle } from "../../hooks/use-inventory-new-slot";

export type InlineInventoryWidgetProps = {
  context?: InventoryCreateContext;
  initialValue?: InventoryPayload;
  value?: Partial<InventoryPayload>;
  onChange: (value: InventoryPayload) => void;
  ref: Ref<InventoryWidgetHandle>;
};

const DEFAULT_VALUE: InventoryPayload = {
  sku: "",
  locations: [],
};

const schema = z.fromJSONSchema(InventoryPayloadSchema) as z.ZodType<
  InventoryPayload,
  InventoryPayload
>;

export default function InlineInventoryWidget({
  context,
  initialValue,
  value,
  onChange,
  ref,
}: InlineInventoryWidgetProps) {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });
  const locations = (locationsData?._embedded?.locationResponseList ?? [])
    .filter((location) => location.active);

  const form = useForm<InventoryPayload>({
    defaultValues: initialValue ?? (value as InventoryPayload | undefined) ?? DEFAULT_VALUE,
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { reset, register, watch, setValue, getValues, formState: { errors } } = form;

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

  useEffect(() => {
    if (context?.sku) {
      setValue("sku", context.sku);
    }
  }, [context?.sku, setValue]);

  const emitChange = useCallback(async () => {
    onChange(getValues());
  }, [getValues, onChange]);

  const { debounceFn: debouncedEmitChange } = useDebounce(emitChange, 300);

  useEffect(() => {
    const subscription = watch((_next, { name }) => {
      if (name && locations.length === 1) {
        debouncedEmitChange();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedEmitChange, locations.length]);

  useImperativeHandle(ref, () => {
    return {
      validate: async () => {
        const isValid = await form.trigger();
        if (isValid) {
          return { value: getValues() };
        }

        return { errors: collectFormErrors(form.formState.errors) };
      },
      getValues: () => getValues(),
      reset: () => {
        const defaultLocations = locations.length > 0
          ? [{
              locationId: locations[0].id,
              initialQuantity: 0,
              safetyStock: 0,
            }]
          : [];
        const next: InventoryPayload = {
          sku: context?.sku ?? "",
          locations: defaultLocations,
        };
        reset(next);
        onChange(next);
      },
    };
  }, [form, reset, getValues, onChange, locations, context?.sku]);

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
