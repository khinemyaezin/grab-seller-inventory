
import { LocationFormValues, LocationType, CreateLocationRequest, LocationLifecycleEvent } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { LocationBasicFieldSet } from "./location-basic-fieldset";
import { useCreateLocationMutation } from "@/features/inventory/hooks/use-locations";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";

export type LocationNewFormProps = {
    onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
}

const DEFAULT_FORM_VALUES: LocationFormValues = {
    code: "",
    name: "",
    type: "WAREHOUSE",
    address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    }
}

export default function LocationNewForm({ onLifecycleEvent }: LocationNewFormProps) {
    const createLocationLink = useInventoryLink("createLocation");
    const form = useForm<LocationFormValues>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: "onSubmit",
    });
    const { handleSubmit, formState: { isDirty } } = form;
    const createLocationMutation = useCreateLocationMutation();

    const handleFormSubmit = async (values: LocationFormValues) => {
        if (!createLocationLink) return;
        const payload: CreateLocationRequest = {
            code: values.code,
            name: values.name,
            type: values.type as LocationType,
            address: {
                line1: values.address.line1,
                line2: values.address.line2 || undefined,
                city: values.address.city,
                state: values.address.state,
                postalCode: values.address.postalCode,
                country: values.address.country,
            },
        };

        try {
            await createLocationMutation.mutateAsync({link: createLocationLink, request: payload});
            onLifecycleEvent?.({ type: "created" });
        } catch {
            onLifecycleEvent?.({ type: "createFailed" });
        }
    };

    if (!createLocationLink) return null;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)}
                className="">
                <Card>
                    <CardContent>
                        <LocationBasicFieldSet />
                    </CardContent>
                    {isDirty && (
                        <CardFooter className="flex justify-end border-t">
                            <ButtonGroup>
                                <ButtonGroup>

                                    <Button type="submit" disabled={createLocationMutation.isPending || createLocationMutation.isSuccess}>
                                        <ButtonStatus
                                            status={
                                                createLocationMutation.isPending
                                                    ? "pending"
                                                    : createLocationMutation.isSuccess
                                                        ? "success"
                                                        : "idle"
                                            }
                                            pendingLabel="Saving…"
                                            successLabel="Saved">
                                            Save
                                        </ButtonStatus>
                                    </Button>

                                </ButtonGroup>
                            </ButtonGroup>
                        </CardFooter>
                    )}
                </Card>
            </form>
        </FormProvider>
    )
}