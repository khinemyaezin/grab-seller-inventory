import { useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  AnnounceInTransitFormValues,
  AnnounceInTransitRequest,
  ItemLifecycleEvent,
} from "@/features/inventory/types";
import { useAnnounceInTransitMutation } from "@/features/inventory/hooks/use-items";

export type ItemAnnounceInTransitFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemAnnounceInTransitForm({
  link,
  onLifecycleEvent,
}: ItemAnnounceInTransitFormProps) {
  const form = useForm<AnnounceInTransitFormValues>({
    defaultValues: { quantity: 1, referenceId: "" },
    mode: "onSubmit",
  });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useAnnounceInTransitMutation();

  const onSubmit = async (values: AnnounceInTransitFormValues) => {
    const payload: AnnounceInTransitRequest = {
      quantity: values.quantity,
      referenceId: values.referenceId || undefined,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset({ quantity: 1, referenceId: "" });
      onLifecycleEvent?.({ type: "inTransitAnnounced" });
    } catch {
      onLifecycleEvent?.({ type: "inTransitAnnounceFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="announce-qty">Quantity</FieldLabel>
          <Input
            id="announce-qty"
            type="number"
            min={1}
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Must be at least 1" },
            })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="announce-ref">Reference (optional)</FieldLabel>
          <Input id="announce-ref" {...register("referenceId")} placeholder="PO-123" />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
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
              Announce and bound
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
