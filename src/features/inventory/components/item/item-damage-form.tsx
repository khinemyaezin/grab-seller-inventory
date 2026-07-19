import { useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent, MarkDamagedFormValues, MarkDamagedRequest } from "@/features/inventory/types";
import { useMarkDamagedMutation } from "@/features/inventory/hooks/use-items";

export type ItemDamageFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

const DEFAULT_VALUES: MarkDamagedFormValues = { quantity: 1, notes: "" };

export default function ItemDamageForm({ link, onLifecycleEvent }: ItemDamageFormProps) {
  const form = useForm<MarkDamagedFormValues>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useMarkDamagedMutation();

  const onSubmit = async (values: MarkDamagedFormValues) => {
    const payload: MarkDamagedRequest = {
      quantity: values.quantity,
      notes: values.notes.trim() || undefined,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset(DEFAULT_VALUES);
      onLifecycleEvent?.({ type: "damaged" });
    } catch {
      onLifecycleEvent?.({ type: "damageFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="damage-quantity">Quantity</FieldLabel>
          <Input
            id="damage-quantity"
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
        <Field className="col-span-2">
          <FieldLabel htmlFor="damage-notes">Notes</FieldLabel>
          <Input id="damage-notes" {...register("notes")} placeholder="Optional" />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <ButtonStatus
              status={mutation.isPending ? "pending" : mutation.isSuccess ? "success" : "idle"}
              pendingLabel="Marking…"
              successLabel="Marked"
            >
              Mark damaged
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
