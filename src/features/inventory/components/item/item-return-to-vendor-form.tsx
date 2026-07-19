import { useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent, ReturnToVendorFormValues, ReturnToVendorRequest } from "@/features/inventory/types";
import { useReturnToVendorMutation } from "@/features/inventory/hooks/use-items";

export type ItemReturnToVendorFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

const DEFAULT_VALUES: ReturnToVendorFormValues = { quantity: 1, reason: "", notes: "" };

export default function ItemReturnToVendorForm({ link, onLifecycleEvent }: ItemReturnToVendorFormProps) {
  const form = useForm<ReturnToVendorFormValues>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useReturnToVendorMutation();

  const onSubmit = async (values: ReturnToVendorFormValues) => {
    const payload: ReturnToVendorRequest = {
      quantity: values.quantity,
      reason: values.reason.trim(),
      notes: values.notes.trim() || undefined,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset(DEFAULT_VALUES);
      onLifecycleEvent?.({ type: "returnedToVendor" });
    } catch {
      onLifecycleEvent?.({ type: "returnToVendorFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="rtv-quantity">Quantity</FieldLabel>
          <Input
            id="rtv-quantity"
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
          <FieldLabel htmlFor="rtv-reason">Reason</FieldLabel>
          <Input
            id="rtv-reason"
            {...register("reason", { required: "Reason is required" })}
            placeholder="Defective, excess…"
          />
          {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
        </Field>
        <Field className="col-span-2">
          <FieldLabel htmlFor="rtv-notes">Notes</FieldLabel>
          <Input id="rtv-notes" {...register("notes")} placeholder="Optional" />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <ButtonStatus
              status={mutation.isPending ? "pending" : mutation.isSuccess ? "success" : "idle"}
              pendingLabel="Returning…"
              successLabel="Returned"
            >
              Return to vendor
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
