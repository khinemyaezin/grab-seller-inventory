
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import type { LocationFormValues, LocationType } from "@/features/inventory/types";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@khinemyaezin/seller-ui/components/field";

export type LocationFormProps = {
}

const LOCATION_TYPES: LocationType[] = ["WAREHOUSE", "STORE", "DISTRIBUTION_CENTER"];


export function LocationBasicFieldSet({ }: LocationFormProps) {
  const { control, register, formState: { errors } } = useFormContext<LocationFormValues>();

  return (
    <>
      <FieldSet>
        <FieldLegend>Basic Information</FieldLegend>
        <FieldDescription>Basic details to identify and classify the location</FieldDescription>

        <FieldGroup className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.code}>
            <FieldLabel htmlFor="code">Code</FieldLabel>
            <Input
              id="code"
              aria-invalid={!!errors.code}
              {...register("code", { required: "Code is required" })}
              placeholder="WH-001"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </Field>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register("name", { required: "Name is required" })}
              placeholder="Main Warehouse"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </Field>
          <Field data-invalid={!!errors.type}>
            <FieldLabel htmlFor="type">Type</FieldLabel>
            <Controller
              control={control}
              name="type"
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} aria-invalid={!!errors.type}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator className="my-6" />
      <FieldSet>
        <FieldLegend>Address</FieldLegend>
        <FieldDescription>Physical location details for delivery and logistics.</FieldDescription>
        <FieldGroup>
          <Field className="space-y-2" data-invalid={!!errors.address?.line1}>
            <FieldLabel htmlFor="address.line1">Address Line 1</FieldLabel>
            <Input
              id="address.line1"
              aria-invalid={!!errors.address?.line1}
              {...register("address.line1", { required: "Address is required" })}
              placeholder="123 Main St"
            />
            {errors.address?.line1 && (
              <p className="text-sm text-destructive">{errors.address.line1.message}</p>
            )}
          </Field>
          <Field className="space-y-2" data-invalid={!!errors.address?.line2}>
            <FieldLabel htmlFor="address.line2">Address Line 2</FieldLabel>
            <Input
              id="address.line2"
              aria-invalid={!!errors.address?.line2}
              {...register("address.line2")}
              placeholder="Suite 100"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field className="space-y-2" data-invalid={!!errors.address?.city}>
              <FieldLabel htmlFor="address.city">City</FieldLabel>
              <Input
                id="address.city"
                aria-invalid={!!errors.address?.city}
                {...register("address.city", { required: "City is required" })}
                placeholder="New York"
              />
              {errors.address?.city && (
                <p className="text-sm text-destructive">{errors.address.city.message}</p>
              )}
            </Field>
            <Field className="space-y-2" data-invalid={!!errors.address?.state}>
              <FieldLabel htmlFor="address.state">State / Province</FieldLabel>
              <Input
                id="address.state"
                aria-invalid={!!errors.address?.state}
                {...register("address.state", { required: "State is required" })}
                placeholder="NY"
              />
              {errors.address?.state && (
                <p className="text-sm text-destructive">{errors.address.state.message}</p>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field className="space-y-2" data-invalid={!!errors.address?.postalCode}>
              <FieldLabel htmlFor="address.postalCode">Postal Code</FieldLabel>
              <Input
                id="address.postalCode"
                aria-invalid={!!errors.address?.postalCode}
                {...register("address.postalCode", { required: "Postal code is required" })}
                placeholder="10001"
              />
              {errors.address?.postalCode && (
                <p className="text-sm text-destructive">{errors.address.postalCode.message}</p>
              )}
            </Field>
            <Field className="space-y-2" data-invalid={!!errors.address?.country}>
              <FieldLabel htmlFor="address.country">Country</FieldLabel>
              <Input
                id="address.country"
                aria-invalid={!!errors.address?.country}
                {...register("address.country", { required: "Country is required" })}
                placeholder="US"
              />
              {errors.address?.country && (
                <p className="text-sm text-destructive">{errors.address.country.message}</p>
              )}
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
