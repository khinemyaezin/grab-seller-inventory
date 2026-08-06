import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import { useEffect } from "react";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { SellerPlatform } from "@khinemyaezin/seller-contracts";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";

export type InventoryLineValue = {
  sku: string;
  locationId: string;
  initialQuantity: number | "";
  safetyStock?: number | "";
  reorderPoint?: number | "";
  reorderQuantity?: number | "";
  maxStock?: number | "";
};

export type InventoryFieldName =
  | "locationId"
  | "initialQuantity"
  | "safetyStock";

export type ProductInventoryWidgetProps = {
  sku: string;
  value: InventoryLineValue;
  onChange: (next: InventoryLineValue) => void;
  errors?: Partial<Record<InventoryFieldName, string>>;
  onBlur?: (field: InventoryFieldName) => void;
  platform?: SellerPlatform;
  entryLink: HateoasLink;
};

export default function ProductInventoryWidget({
  sku,
  value,
  onChange,
  errors,
  onBlur,
}: ProductInventoryWidgetProps) {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });
  const locations = locationsData?._embedded?.locationResponseList ?? [];

  useEffect(() => {
    if (!value?.locationId && locations.length > 0) {
      onChange({
        ...value,
        sku: sku?.trim() || value?.sku || "",
        locationId: locations[0].id,
      });
    }
  }, [value, locations, onChange, sku]);

  const fieldId = sku?.trim() || value?.sku || "line";
  const locationId = value?.locationId ?? "";
  const initialQuantity = value?.initialQuantity ?? "";
  const safetyStock = value?.safetyStock ?? "";

  const locationError = errors?.locationId;
  const quantityError = errors?.initialQuantity;

  return (
    <FieldGroup className="grid gap-4">
      <Field data-invalid={!!locationError}>
        <FieldLabel>Location</FieldLabel>
        <Select
          value={locationId}
          onValueChange={(nextLocationId) => {
            onChange({
              ...value,
              sku: sku?.trim() || value.sku || "",
              locationId: nextLocationId,
            });
            onBlur?.("locationId");
          }}
        >
          <SelectTrigger aria-invalid={!!locationError}>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2 text-center">
                No locations available.
              </div>
            ) : (
              locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} {location.code ? `(${location.code})` : ""}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {locationError ? <FieldError>{locationError}</FieldError> : null}
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field data-invalid={!!quantityError}>
          <FieldLabel htmlFor={`inventory-${fieldId}-qty`}>
            Initial quantity
          </FieldLabel>
          <Input
            id={`inventory-${fieldId}-qty`}
            type="number"
            min={0}
            value={initialQuantity}
            placeholder="0"
            onChange={(event) => {
              const raw = event.target.value;
              onChange({
                ...value,
                sku: sku?.trim() || value.sku || "",
                initialQuantity: raw === "" ? "" : Number(raw),
              });
            }}
            onBlur={() => onBlur?.("initialQuantity")}
            aria-invalid={!!quantityError}
          />
          {quantityError ? <FieldError>{quantityError}</FieldError> : null}
        </Field>

        <Field>
          <FieldLabel htmlFor={`inventory-${fieldId}-safety`}>
            Safety stock
          </FieldLabel>
          <Input
            id={`inventory-${fieldId}-safety`}
            type="number"
            min={0}
            value={safetyStock}
            placeholder="0"
            onChange={(event) => {
              const raw = event.target.value;
              onChange({
                ...value,
                sku: sku?.trim() || value.sku || "",
                safetyStock: raw === "" ? "" : Number(raw),
              });
            }}
            onBlur={() => onBlur?.("safetyStock")}
          />
        </Field>
      </div>
    </FieldGroup>
  );
}
