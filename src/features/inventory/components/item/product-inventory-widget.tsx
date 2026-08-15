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
import {
  InventoryCreateContext,
  InventoryPayload,
  InventoryPayloadSchema,
  type InventoryLocationStock,
} from "@khinemyaezin/seller-contracts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useDebounce } from "@khinemyaezin/seller-ui";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import type { InventoryWidgetHandle } from "./product-inventory-widget-exposed";
import { LocationPickerDialog } from "./location-picker-dialog";
import { collectFormErrors } from "./inventory-widget-utils";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Pencil } from "lucide-react";

export type ProductInventoryWidgetProps = {
  context?: InventoryCreateContext;
  value?: InventoryPayload;
  onChange: (value: InventoryPayload) => void;
  ref: Ref<InventoryWidgetHandle>;
};

const DEFAULT_VALUE: InventoryPayload = {
  sku: "",
  locations: [],
};

const schema = z.fromJSONSchema(InventoryPayloadSchema) as z.ZodType<
  InventoryPayload,
  InventoryPayload
>;

export default function ProductInventoryWidget({
  context,
  value,
  onChange,
  ref,
}: ProductInventoryWidgetProps) {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });
  const locations = useMemo(() => {
    return (locationsData?._embedded?.locationResponseList ?? [])
      .filter((location) => location.active);
  }, [locationsData]);

  const locationById = useMemo(
    () => new Map(locations.map((location) => [location.id, location])),
    [locations],
  );

  const [pickerOpen, setPickerOpen] = useState(false);

  const form = useForm<InventoryPayload>({
    defaultValues: DEFAULT_VALUE,
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { control, reset, register, watch, formState: { errors } } = form;
  const { fields, replace } = useFieldArray({ control, name: "locations" });
  const isSeeded = useRef(false);

  useEffect(() => {
    if (isSeeded.current) return;
    if (!locations.length) return;
    const initialLocations = value?.locations?.length
      ? value.locations
      : locations.map((loc) => ({
        locationId: loc.id,
        initialQuantity: 0,
        safetyStock: 0,
      }));
    reset({ ...DEFAULT_VALUE, ...value, ...context, locations: initialLocations });
    isSeeded.current = true;
    void form.trigger();
  }, [locations, value, context, reset, form]);

  useEffect(() => {
    if (!isSeeded.current || !context) return;
    const current = form.getValues();
    reset({ ...current, ...context });
    void form.trigger();
  }, [context, reset, form]);

  const prevValueRef = useRef(value);
  useEffect(() => {
    if (!isSeeded.current) return;
    if (value === prevValueRef.current) return;
    prevValueRef.current = value;
    const current = form.getValues();
    const nextLocations = value?.locations?.length
      ? value.locations
      : current.locations;
    reset({ ...current, ...value, locations: nextLocations });
    void form.trigger();
  }, [value, reset, form]);


  const emitChange = useCallback(async () => {
    await form.trigger();
    onChange(form.getValues());
  }, [form, onChange]);

  const { debounceFn: debouncedEmitChange } = useDebounce(emitChange, 300);

  useEffect(() => {
    const subscription = watch((_next, { name }) => {
      if (name) {
        debouncedEmitChange();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedEmitChange]);

  useImperativeHandle(ref, () => {
    return {
      validate: async () => {
        const isValid = await form.trigger();
        if (isValid) {
          return { value: form.getValues() };
        }

        return { errors: collectFormErrors(form.formState.errors) };
      },
      getValues: () => form.getValues(),
    };
  }, [form]);

  const applyLocationSelection = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    const current = form.getValues("locations");
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
    void emitChange();
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
                )
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
