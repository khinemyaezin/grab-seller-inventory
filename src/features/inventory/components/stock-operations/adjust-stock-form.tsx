import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "@khinemyaezin/seller-ui/components/field";
import {
  InputGroup,
  InputGroupInput,
} from "@khinemyaezin/seller-ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import { Ref, useEffect, useImperativeHandle } from "react";
import { ADJUSTMENT_REASONS, AdjustStockFormValues } from "@/features/inventory/types";
import type { StockOperationFormHandle, StockOperationSubmit } from "./types";
import { formatEnumLabel } from "./types";

export type AdjustStockFormProps = {
  value?: AdjustStockFormValues;
  ref: Ref<StockOperationFormHandle>;
};

export default function AdjustStockForm({ value, ref }: AdjustStockFormProps) {
  const form = useForm<AdjustStockFormValues>({
    defaultValues: value ?? {
      newOnHandQuantity: 0,
      reason: "CORRECTION",
    },
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (value) {
      reset({ ...value });
    }
  }, [value, reset]);

  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        new Promise<StockOperationSubmit | null>((resolve) => {
          void handleSubmit(
            (values) => resolve({ op: "ADJUST", value: values }),
            () => resolve(null),
          )();
        }),
    }),
    [handleSubmit],
  );

  return (
    <div className="flex flex-col gap-2">
      <Field data-invalid={!!errors.newOnHandQuantity} className="gap-1">
        <InputGroup className="w-full">
          <InputGroupInput
            type="number"
            aria-label="Quantity"
            aria-invalid={!!errors.newOnHandQuantity}
            {...register("newOnHandQuantity", {
              valueAsNumber: true,
              required: "Quantity is required",
              min: {
                value: 0,
                message: "Must be 0 or greater",
              },
            })}
          />
        </InputGroup>
        {errors.newOnHandQuantity ? (
          <FieldError errors={[errors.newOnHandQuantity]} />
        ) : null}
      </Field>
      <Field data-invalid={!!errors.reason} className="gap-1">
        <Controller
          control={control}
          name="reason"
          rules={{ required: "Reason is required" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.reason}>
                <SelectValue placeholder="Inventory reason" />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {formatEnumLabel(reason)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.reason ? <FieldError errors={[errors.reason]} /> : null}
      </Field>
    </div>
  );
}
