
import { HateoasLink, LocationFormValues, LocationResponse, LocationType, CreateLocationRequest } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { toast } from "sonner";
import { LocationBasicFieldSet } from "./location-basic-fieldset";
import { useCreateLocationMutation } from "@/features/inventory/hooks/use-locations";

export type LocationNewFormProps = {
    link: HateoasLink
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

export default function LocationNewForm({ link }: LocationNewFormProps) {
    const form = useForm<LocationFormValues>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: "onSubmit",
    });
    const { handleSubmit, formState: { isDirty } } = form;
    const createLocationMutation = useCreateLocationMutation();

    const handleFormSubmit = async (values: LocationFormValues) => {
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
            await createLocationMutation.mutateAsync({link: link, request: payload});
            toast.success("Location created", { position: "top-center" });
        } catch {
            toast.error("Failed to create location", { position: "top-center" });
        }
    };

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

                                    <Button type="submit" disabled={createLocationMutation.isPending}>
                                        {createLocationMutation.isPending ? "Saving..." : "Save Changes"}
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