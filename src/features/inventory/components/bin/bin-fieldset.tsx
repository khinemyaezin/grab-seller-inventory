
import { Input } from "@khinemyaezin/seller-ui/components/index"
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from "@khinemyaezin/seller-ui/components/field"
import type { BinFormValues } from "@/features/inventory/types"
import { useFormContext } from "react-hook-form"

export default function BinFieldSet() {
    const { register, formState: { errors } } = useFormContext<BinFormValues>();
    return (
        <FieldSet>
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                    <Field data-invalid={!!errors.code}>
                        <FieldLabel htmlFor="input-bin-code">
                            Code
                        </FieldLabel>
                        <Input
                            id="input-bin-code"
                            placeholder="Enter code"
                            aria-invalid={!!errors.code}
                            {...register("code", { required: "Code is required" })} />
                        {errors.code && (
                            <FieldError errors={[errors.code]} />
                        )}
                    </Field>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="input-bin-name">
                            Name
                        </FieldLabel>
                        <Input
                            id="input-bin-name"
                            placeholder="Enter name"
                            aria-invalid={!!errors.name}
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <FieldError errors={[errors.name]} />
                        )}
                    </Field>
                </div>
                <Field data-invalid={!!errors.maxCapacity}>
                    <FieldLabel htmlFor="input-bin-capacity">
                        Max Capacity
                    </FieldLabel>
                    <Input
                        id="input-bin-capacity"
                        type="number"
                        min={1}
                        placeholder="Enter max capacity"
                        aria-invalid={!!errors.maxCapacity}
                        {...register("maxCapacity", {
                            required: "Max capacity is required",
                            valueAsNumber: true,
                            min: { value: 1, message: "Must be at least 1" },
                        })}
                    />
                    {errors.maxCapacity && (
                        <FieldError errors={[errors.maxCapacity]} />
                    )}
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}
