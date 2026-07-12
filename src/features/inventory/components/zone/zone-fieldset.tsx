
import { Input } from "@khinemyaezin/seller-ui/components/index"
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from "@khinemyaezin/seller-ui/components/field"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@khinemyaezin/seller-ui/components/select"
import { ZoneFormValues } from "@/features/inventory/types"
import { ZONE_TYPES } from "@/features/inventory/types/inventory.model"
import { Controller, useFormContext } from "react-hook-form"

export type ZoneFieldSetProps = {

}

export default function ZoneFieldSet({ }: ZoneFieldSetProps) {
    const { register, control, formState: { errors } } = useFormContext<ZoneFormValues>();
    return (
        <FieldSet>
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                    <Field data-invalid={!!errors.code}>
                        <FieldLabel htmlFor="input-zone-code">
                            Code
                        </FieldLabel>
                        <Input
                            id="input-zone-code"
                            placeholder="Enter code"
                            aria-invalid={!!errors.code}
                            {...register("code", { required: "Code is required" })} />
                        {errors.code && (
                            <FieldError errors={[errors.code]} />
                        )}
                    </Field>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="input-zone-name">
                            Name
                        </FieldLabel>
                        <Input
                            id="input-zone-name"
                            placeholder="Enter name"
                            aria-invalid={!!errors.name}
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <FieldError errors={[errors.name]} />
                        )}
                    </Field>
                </div>
                <Field>
                    <FieldLabel>
                        Type
                    </FieldLabel>
                    <Controller
                        control={control}
                        name="type"
                        rules={{ required: "Zone type is required" }}
                        render={({ field, fieldState }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ZONE_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}