import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  ItemLifecycleEvent,
  UpdateReorderConfigFormValues,
  UpdateReorderConfigRequest,
} from "@/features/inventory/types";
import { useUpdateReorderConfigMutation } from "@/features/inventory/hooks/use-items";

export type ItemReorderConfigFormProps = {
  link: HateoasLink;
  safetyStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number | null;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemReorderConfigForm({
  link,
  safetyStock,
  reorderPoint,
  reorderQuantity,
  maxStock,
  onLifecycleEvent,
}: ItemReorderConfigFormProps) {
  const form = useForm<UpdateReorderConfigFormValues>({
    defaultValues: { safetyStock, reorderPoint, reorderQuantity, maxStock },
    mode: "onSubmit",
  });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useUpdateReorderConfigMutation();

  useEffect(() => {
    reset({ safetyStock, reorderPoint, reorderQuantity, maxStock });
  }, [safetyStock, reorderPoint, reorderQuantity, maxStock, reset]);

  const onSubmit = async (values: UpdateReorderConfigFormValues) => {
    const payload: UpdateReorderConfigRequest = {
      safetyStock: values.safetyStock,
      reorderPoint: values.reorderPoint,
      reorderQuantity: values.reorderQuantity,
      maxStock: values.maxStock == null || Number.isNaN(values.maxStock) ? null : values.maxStock,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset(values);
      onLifecycleEvent?.({ type: "reorderConfigUpdated" });
    } catch {
      onLifecycleEvent?.({ type: "reorderConfigUpdateFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.safetyStock}>
          <FieldLabel htmlFor="safety-stock">Safety stock</FieldLabel>
          <Input
            id="safety-stock"
            type="number"
            min={0}
            {...register("safetyStock", {
              required: true,
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
        </Field>
        <Field data-invalid={!!errors.reorderPoint}>
          <FieldLabel htmlFor="reorder-point">Reorder point</FieldLabel>
          <Input
            id="reorder-point"
            type="number"
            min={0}
            {...register("reorderPoint", {
              required: true,
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
        </Field>
        <Field data-invalid={!!errors.reorderQuantity}>
          <FieldLabel htmlFor="reorder-qty">Reorder quantity</FieldLabel>
          <Input
            id="reorder-qty"
            type="number"
            min={0}
            {...register("reorderQuantity", {
              required: true,
              valueAsNumber: true,
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="max-stock">Max stock (optional)</FieldLabel>
          <Input
            id="max-stock"
            type="number"
            min={0}
            {...register("maxStock", {
              setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <ButtonStatus status={
              mutation.isPending
                ? "pending"
                : mutation.isSuccess
                  ? "success"
                  : "idle"
            }>Save reorder config</ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
