import { useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Ref, useEffect, useImperativeHandle } from "react";
import type { CreateInventoryItemValues } from "@/features/inventory/types";
import type { LocationValues, StockOperationFormHandle, StockOperationSubmit } from "./types";

export type CreateStockFormProps = {
  value?: CreateInventoryItemValues;
  locations: LocationValues;
  ref: Ref<StockOperationFormHandle>;
};

export default function CreateStockForm({
  value,
  locations,
  ref,
}: CreateStockFormProps) {
  const form = useForm<CreateInventoryItemValues>({
    defaultValues: value ?? {
      locationId: locations?.locationId ?? "",
      initialQuantity: 0,
      safetyStock: 0,
      reorderPoint: 0,
      reorderQuantity: 0,
      maxStock: "",
    },
  });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (value) {
      reset({ ...value });
    }
  }, [value, reset]);

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<StockOperationSubmit | null>((resolve) => {
        void handleSubmit(
          (values) => resolve({ op: "CREATE", value: values }),
          () => resolve(null),
        )();
      }),
  }), [handleSubmit]);

  return (
    <div className="grid gap-3">
      <Field data-invalid={!!errors.initialQuantity}>
        <FieldLabel>Initial quantity</FieldLabel>
        <Input
          type="number"
          min={0}
          aria-invalid={!!errors.initialQuantity}
          {...register("initialQuantity", {
            valueAsNumber: true,
            min: { value: 0, message: "Must be 0 or greater" },
            required: "Quantity is required",
          })}
        />
        {errors.initialQuantity ? <FieldError errors={[errors.initialQuantity]} /> : null}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={!!errors.safetyStock}>
          <FieldLabel>Safety stock</FieldLabel>
          <Input
            type="number"
            min={0}
            aria-invalid={!!errors.safetyStock}
            {...register("safetyStock", {
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors.safetyStock ? <FieldError errors={[errors.safetyStock]} /> : null}
        </Field>
        <Field data-invalid={!!errors.reorderPoint}>
          <FieldLabel>Reorder point</FieldLabel>
          <Input
            type="number"
            min={0}
            aria-invalid={!!errors.reorderPoint}
            {...register("reorderPoint", {
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors.reorderPoint ? <FieldError errors={[errors.reorderPoint]} /> : null}
        </Field>
        <Field data-invalid={!!errors.reorderQuantity}>
          <FieldLabel>Reorder quantity</FieldLabel>
          <Input
            type="number"
            min={0}
            aria-invalid={!!errors.reorderQuantity}
            {...register("reorderQuantity", {
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors.reorderQuantity ? <FieldError errors={[errors.reorderQuantity]} /> : null}
        </Field>
        <Field>
          <FieldLabel>Max stock</FieldLabel>
          <Input type="number" min={0} {...register("maxStock", { valueAsNumber: true })} />
        </Field>
      </div>
    </div>
  );
}
