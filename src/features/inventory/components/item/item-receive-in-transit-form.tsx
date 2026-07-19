import { useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  ItemLifecycleEvent,
  ReceiveInTransitFormValues,
  ReceiveInTransitRequest,
} from "@/features/inventory/types";
import { useReceiveInTransitMutation } from "@/features/inventory/hooks/use-items";

export type ItemReceiveInTransitFormProps = {
  link: HateoasLink;
  maxQuantity: number;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemReceiveInTransitForm({
  link,
  maxQuantity,
  onLifecycleEvent,
}: ItemReceiveInTransitFormProps) {
  const form = useForm<ReceiveInTransitFormValues>({
    defaultValues: { quantity: Math.min(1, Math.max(maxQuantity, 0)), referenceId: "" },
    mode: "onSubmit",
  });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useReceiveInTransitMutation();

  const onSubmit = async (values: ReceiveInTransitFormValues) => {
    const payload: ReceiveInTransitRequest = {
      quantity: values.quantity,
      referenceId: values.referenceId || undefined,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset({ quantity: 1, referenceId: "" });
      onLifecycleEvent?.({ type: "inTransitReceived" });
    } catch {
      onLifecycleEvent?.({ type: "inTransitReceiveFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="receive-in-transit-qty">Quantity (max {maxQuantity})</FieldLabel>
          <Input
            id="receive-in-transit-qty"
            type="number"
            min={1}
            max={maxQuantity}
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Must be at least 1" },
              max: { value: maxQuantity, message: `Cannot exceed ${maxQuantity}` },
            })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="receive-in-transit-ref">Reference (optional)</FieldLabel>
          <Input id="receive-in-transit-ref" {...register("referenceId")} placeholder="PO-123" />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending || maxQuantity <= 0}>
            <ButtonStatus
              status={
                mutation.isPending
                  ? "pending"
                  : mutation.isSuccess
                    ? "success"
                    : "idle"
              }
              pendingLabel="Saving…"
              successLabel="Saved"
            >
              Receive inbound
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
