import { HateoasLink, LocationFormValues, LocationResponse, LocationType, LocationLifecycleEvent } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { resolveLink } from "@khinemyaezin/seller-api";
import { useUpdateLocationMutation, useActivateLocationMutation, useDeactivateLocationMutation, useLocation } from "@/features/inventory/hooks/use-locations";
import { useEffect } from "react";
import { LocationBasicFieldSet } from "./location-basic-fieldset";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";

export type LocationEditFormProps = {
    locationId: string,
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

function locationToFormValues(location: LocationResponse): LocationFormValues {
    return {
        code: location.code,
        name: location.name,
        type: location.type,
        address: {
            line1: location?.address.line1,
            line2: location?.address.line2 || "",
            city: location?.address.city,
            state: location?.address.state,
            postalCode: location?.address.postalCode,
            country: location?.address.country,
        },
    };
}

export default function LocationEditForm({ locationId, onLifecycleEvent }: LocationEditFormProps) {
    const locationLink = useInventoryLink("location");
    const form = useForm<LocationFormValues>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: "onSubmit",
    });
    const { handleSubmit, reset, formState: { isDirty } } = form;

    const { data: location, refetch } = useLocation(locationLink, locationId)
    const updateMutation = useUpdateLocationMutation();
    const activateMutation = useActivateLocationMutation();
    const deactivateMutation = useDeactivateLocationMutation();

    const updateLink = resolveLink(location?._links, "edit-location");
    const activateLink = resolveLink(location?._links, "activate-location");
    const deactivateLink = resolveLink(location?._links, "deactivate-location");

    useEffect(() => {
        if (location?.name) {
            onLifecycleEvent?.({ type: "titleResolved", title: location.name });
        }
    }, [location?.name, onLifecycleEvent]);

    useEffect(() => {
        if (location) {
            reset(locationToFormValues(location));
        }
    }, [location, reset]);

    const handleFormSubmit = async (values: LocationFormValues) => {
        if (!updateLink) return;

        try {
            await updateMutation.mutateAsync({
                link: updateLink,
                request: {
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
                },
            });
            refetch();
            onLifecycleEvent?.({ type: "updated" });
        } catch {
            onLifecycleEvent?.({ type: "updateFailed" });
        }
    };

    const handleOnActivate = async (link: HateoasLink) => {
        if (!link) return;
        try {
            await activateMutation.mutateAsync(link);
            refetch();
            onLifecycleEvent?.({ type: "activated" });
        } catch {
            onLifecycleEvent?.({ type: "activateFailed" });
        }
    };

    const handleOnDeactivate = async (link: HateoasLink) => {
        if (!link) return;
        try {
            await deactivateMutation.mutateAsync(link);
            refetch();
            onLifecycleEvent?.({ type: "deactivated" });
        } catch {
            onLifecycleEvent?.({ type: "deactivateFailed" });
        }
    };

    if (!locationLink) return null;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)}
                className="">
                <Card>
                    <CardContent>
                        <LocationBasicFieldSet />
                    </CardContent>
                    <CardFooter className="flex justify-end border-t">
                        <ButtonGroup>
                            <ButtonGroup>
                                {activateLink && (
                                    <Button type="button" disabled={activateMutation.isPending}
                                        onClick={() => handleOnActivate(activateLink)} >Activate</Button>
                                )}
                                {deactivateLink && (
                                    <Button type="button" variant="destructive" disabled={deactivateMutation.isPending}
                                        onClick={() => handleOnDeactivate(deactivateLink)}>Deactivate</Button>
                                )}
                            </ButtonGroup>
                            <ButtonGroup>
                                {updateLink && isDirty && (
                                    <Button type="submit" disabled={updateMutation.isPending || updateMutation.isSuccess}>
                                        <ButtonStatus
                                            status={
                                                updateMutation.isPending
                                                    ? "pending"
                                                    : updateMutation.isSuccess
                                                        ? "success"
                                                        : "idle"
                                            }
                                            pendingLabel="Saving…"
                                            successLabel="Saved">
                                            Save
                                        </ButtonStatus>
                                    </Button>
                                )}
                            </ButtonGroup>
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}