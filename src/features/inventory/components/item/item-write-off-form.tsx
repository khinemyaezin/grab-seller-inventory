import { useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent, WriteOffStockFormValues, WriteOffStockRequest } from "@/features/inventory/types";
import { useWriteOffMutation } from "@/features/inventory/hooks/use-items";

export type ItemWriteOffFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

const DEFAULT_VALUES: WriteOffStockFormValues = { quantity: 1, reason: "", notes: "" };

export default function ItemWriteOffForm({ link, onLifecycleEvent }: ItemWriteOffFormProps) {
  const form = useForm<WriteOffStockFormValues>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useWriteOffMutation();

  const onSubmit = async (values: WriteOffStockFormValues) => {
    const payload: WriteOffStockRequest = {
      quantity: values.quantity,
      reason: values.reason.trim(),
      notes: values.notes.trim() || undefined,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset(DEFAULT_VALUES);
      onLifecycleEvent?.({ type: "writtenOff" });
    } catch {
      onLifecycleEvent?.({ type: "writeOffFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="writeoff-quantity">Quantity</FieldLabel>
          <Input
            id="writeoff-quantity"
            type="number"
            min={1}
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Must be at least 1" },
            })}
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
        </Field>
        <Field data-invalid={!!errors.reason}>
          <FieldLabel htmlFor="writeoff-reason">Reason</FieldLabel>
          <Input
            id="writeoff-reason"
            {...register("reason", { required: "Reason is required" })}
            placeholder="Lost, expired, theft…"
          />
          {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
        </Field>
        <Field className="col-span-2">
          <FieldLabel htmlFor="writeoff-notes">Notes</FieldLabel>
          <Input id="writeoff-notes" {...register("notes")} placeholder="Optional" />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <ButtonStatus
              status={mutation.isPending ? "pending" : mutation.isSuccess ? "success" : "idle"}
              pendingLabel="Writing off…"
              successLabel="Written off"
            >
              Write off
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
