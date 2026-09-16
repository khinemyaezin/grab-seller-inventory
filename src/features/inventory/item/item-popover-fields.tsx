import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type {
  InventoryLocationStock,
  InventoryPayload,
} from "@khinemyaezin/seller-contracts";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Pencil } from "lucide-react";
import { useInventoryCreateLocations } from "./item-popover-create-form-context";
import { LocationPickerDialog } from "./location-picker-dialog";

export function ItemPopoverFields() {
  const { locations, locationById } = useInventoryCreateLocations();

  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<InventoryPayload>();
  const { fields, replace } = useFieldArray({ control, name: "locations" });
  const [pickerOpen, setPickerOpen] = useState(false);

  const applyLocationSelection = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    const current = getValues("locations");
    const next: InventoryLocationStock[] = locations
      .filter((location) => selectedIds.includes(location.id))
      .map((location) => {
        const existing = current.find((row) => row.locationId === location.id);
        return {
          locationId: location.id,
          initialQuantity: existing?.initialQuantity ?? 0,
          safetyStock: existing?.safetyStock ?? 0,
        };
      });

    replace(next);
    setPickerOpen(false);
  };

  return (
    <FieldGroup className="grid gap-3">
      <input type="hidden" {...register("sku")} />

      {locations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No locations available.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>
                  <Button type="button" variant="secondary" size="icon-sm" onClick={() => setPickerOpen(true)}>
                    <Pencil data-icon="inline-end" />
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">Initial quantity</TableHead>
                <TableHead className="text-muted-foreground">Safety stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const location = locationById.get(field.locationId);
                return (
                  <TableRow key={field.id}>
                    <TableCell className="align-top">
                      <div className="flex min-h-9 items-center">
                        <input
                          type="hidden"
                          {...register(`locations.${index}.locationId`)}
                        />
                        <span className="text-sm">
                          {location?.name ?? field.locationId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Field data-invalid={!!errors.locations?.[index]?.initialQuantity}>
                        <Input
                          id={`inv-loc-${index}-qty`}
                          type="number"
                          min={0}
                          placeholder="0"
                          aria-label={`initial quantity`}
                          aria-invalid={!!errors.locations?.[index]?.initialQuantity}
                          {...register(`locations.${index}.initialQuantity`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.locations?.[index]?.initialQuantity && <FieldError errors={[errors.locations?.[index]?.initialQuantity]} />}
                      </Field>
                    </TableCell>
                    <TableCell className="align-top">
                      <Field data-invalid={!!errors.locations?.[index]?.safetyStock}>
                        <Input
                          id={`inv-loc-${index}-safety`}
                          type="number"
                          min={0}
                          placeholder="0"
                          aria-label={`safety stock`}
                          aria-invalid={!!errors.locations?.[index]?.safetyStock}
                          {...register(`locations.${index}.safetyStock`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.locations?.[index]?.safetyStock && <FieldError errors={[errors.locations?.[index]?.safetyStock]} />}
                      </Field>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <LocationPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        locations={locations}
        selectedIds={fields.map((field) => field.locationId)}
        onApply={applyLocationSelection}
      />
    </FieldGroup>
  );
}
