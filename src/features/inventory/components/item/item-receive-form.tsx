import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
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
import type { HateoasLink } from "@khinemyaezin/seller-api";
import {
  RECEIVE_STOCK_TYPES,
  type ItemLifecycleEvent,
  type ReceiveStockFormValues,
  type ReceiveStockRequest,
} from "@/features/inventory/types";
import { useReceiveStockMutation } from "@/features/inventory/hooks/use-items";

export type ItemReceiveFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

const DEFAULT_VALUES: ReceiveStockFormValues = {
  quantity: 1,
  type: "PURCHASE_ORDER_RECEIPT",
  referenceId: "",
};

export default function ItemReceiveForm({ link, onLifecycleEvent }: ItemReceiveFormProps) {
  const form = useForm<ReceiveStockFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });
  const { control, register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useReceiveStockMutation();

  const onSubmit = async (values: ReceiveStockFormValues) => {
    const payload: ReceiveStockRequest = {
      quantity: values.quantity,
      type: values.type,
      referenceId: values.referenceId.trim() || undefined,
    };

    try {
      await mutation.mutateAsync({ link, request: payload });
      reset(DEFAULT_VALUES);
      onLifecycleEvent?.({ type: "received" });
    } catch {
      onLifecycleEvent?.({ type: "receiveFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="receive-quantity">Quantity</FieldLabel>
          <Input
            id="receive-quantity"
            type="number"
            min={1}
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Must be at least 1" },
            })}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity.message}</p>
          )}
        </Field>
        <Field data-invalid={!!errors.type}>
          <FieldLabel htmlFor="receive-type">Type</FieldLabel>
          <Controller
            control={control}
            name="type"
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="receive-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {RECEIVE_STOCK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field className="col-span-2">
          <FieldLabel htmlFor="receive-reference">Reference ID</FieldLabel>
          <Input
            id="receive-reference"
            {...register("referenceId")}
            placeholder="Optional PO / transfer reference"
          />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <ButtonStatus
              status={mutation.isPending ? "pending" : mutation.isSuccess ? "success" : "idle"}
              pendingLabel="Receiving…"
              successLabel="Received"
            >
              Receive
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
