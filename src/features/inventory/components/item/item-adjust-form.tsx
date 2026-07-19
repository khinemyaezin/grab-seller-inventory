import { Controller, useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@khinemyaezin/seller-ui/components/field";
import { useEffect } from "react";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import {
  ADJUSTMENT_REASONS,
  type AdjustStockFormValues,
  type AdjustStockRequest,
  type ItemLifecycleEvent,
} from "@/features/inventory/types";
import { useAdjustStockMutation } from "@/features/inventory/hooks/use-items";

export type ItemAdjustFormProps = {
  link: HateoasLink;
  currentOnHand: number;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemAdjustForm({
  link,
  currentOnHand,
  onLifecycleEvent,
}: ItemAdjustFormProps) {
  const form = useForm<AdjustStockFormValues>({
    defaultValues: {
      newOnHandQuantity: currentOnHand,
      reason: "CORRECTION",
    },
    mode: "onSubmit",
  });
  const { control, register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useAdjustStockMutation();

  useEffect(() => {
    reset({ newOnHandQuantity: currentOnHand, reason: "CORRECTION" });
  }, [currentOnHand, reset]);

  const onSubmit = async (values: AdjustStockFormValues) => {
    const payload: AdjustStockRequest = {
      newOnHandQuantity: values.newOnHandQuantity,
      reason: values.reason,
    };

    try {
      await mutation.mutateAsync({ link, request: payload });
      reset({ newOnHandQuantity: values.newOnHandQuantity, reason: "CORRECTION" });
      onLifecycleEvent?.({ type: "adjusted" });
    } catch {
      onLifecycleEvent?.({ type: "adjustFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.newOnHandQuantity}>
          <FieldLabel htmlFor="adjust-quantity">New on-hand quantity</FieldLabel>
          <Input
            id="adjust-quantity"
            type="number"
            min={0}
            {...register("newOnHandQuantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors.newOnHandQuantity && (
            <p className="text-sm text-destructive">{errors.newOnHandQuantity.message}</p>
          )}
        </Field>
        <Field data-invalid={!!errors.reason}>
          <FieldLabel htmlFor="adjust-reason">Reason</FieldLabel>
          <Controller
            control={control}
            name="reason"
            rules={{ required: "Reason is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="adjust-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {formatLabel(reason)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <ButtonStatus
              status={mutation.isPending ? "pending" : mutation.isSuccess ? "success" : "idle"}
              pendingLabel="Adjusting…"
              successLabel="Adjusted"
            >
              Adjust
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
