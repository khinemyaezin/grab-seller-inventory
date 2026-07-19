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
import { Field, FieldGroup, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  ItemLifecycleEvent,
  TransferInventoryFormValues,
  TransferInventoryRequest,
} from "@/features/inventory/types";
import { useTransferInventoryMutation } from "@/features/inventory/hooks/use-items";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";

export type ItemTransferFormProps = {
  link: HateoasLink;
  fromLocationId: string;
  maxQuantity: number;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

const DEFAULT_VALUES: TransferInventoryFormValues = {
  toLocationId: "",
  quantity: 1,
  notes: "",
};

export default function ItemTransferForm({
  link,
  fromLocationId,
  maxQuantity,
  onLifecycleEvent,
}: ItemTransferFormProps) {
  const searchLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLink, { page: 0, size: 100 });
  const locations = (locationsData?._embedded?.locationResponseList ?? []).filter(
    (loc) => loc.id !== fromLocationId && loc.active,
  );

  const form = useForm<TransferInventoryFormValues>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });
  const { control, register, handleSubmit, reset, formState: { errors, isDirty } } = form;
  const mutation = useTransferInventoryMutation();

  const onSubmit = async (values: TransferInventoryFormValues) => {
    const payload: TransferInventoryRequest = {
      toLocationId: values.toLocationId,
      quantity: values.quantity,
      notes: values.notes.trim() || undefined,
    };
    try {
      await mutation.mutateAsync({ link, request: payload });
      reset(DEFAULT_VALUES);
      onLifecycleEvent?.({ type: "transferred" });
    } catch {
      onLifecycleEvent?.({ type: "transferFailed" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.toLocationId} className="col-span-2">
          <FieldLabel htmlFor="transfer-location">Destination location</FieldLabel>
          <Controller
            control={control}
            name="toLocationId"
            rules={{ required: "Destination is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="transfer-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.toLocationId && (
            <p className="text-sm text-destructive">{errors.toLocationId.message}</p>
          )}
        </Field>
        <Field data-invalid={!!errors.quantity}>
          <FieldLabel htmlFor="transfer-quantity">Quantity</FieldLabel>
          <Input
            id="transfer-quantity"
            type="number"
            min={1}
            max={maxQuantity}
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Must be at least 1" },
              max: { value: maxQuantity, message: `Cannot exceed available (${maxQuantity})` },
            })}
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
        </Field>
        <Field className="col-span-2">
          <FieldLabel htmlFor="transfer-notes">Notes</FieldLabel>
          <Input id="transfer-notes" {...register("notes")} placeholder="Optional" />
        </Field>
      </FieldGroup>
      {isDirty && (
        <ButtonGroup className="pt-7 w-full">
          <Button type="submit" className="w-full" disabled={mutation.isPending || locations.length === 0}>
            <ButtonStatus
              status={mutation.isPending ? "pending" : mutation.isSuccess ? "success" : "idle"}
              pendingLabel="Transferring…"
              successLabel="Transferred"
            >
              Transfer
            </ButtonStatus>
          </Button>
        </ButtonGroup>
      )}
    </form>
  );
}
