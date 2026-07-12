
import { useUpdateZoneMutation, useActivateZoneMutation, useDeactivateZoneMutation, useZone } from "@/features/inventory/hooks/use-zones";
import type { HateoasLink } from "@/types";
import type { ZoneFormValues } from "@/features/inventory/types";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import ZoneFieldSet from "./zone-fieldset";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { resolveLink } from "@khinemyaezin/seller-api";

export type ZoneEditFormProps = {
    link: HateoasLink,
    id: string
}

const DEFAULT_FORM_VALUES: ZoneFormValues = {
    code: "",
    name: "",
    type: "STORAGE",
    active: true
}

export default function ZoneEditForm({ link, id }: ZoneEditFormProps) {
    const form = useForm<ZoneFormValues>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: "onSubmit",
    });

    const { handleSubmit, formState: { isDirty }, reset } = form;
    const { data: zone } = useZone(link, id);
    const editZoneLink = resolveLink(zone?._links, "edit-zone");
    const activateZoneLink = resolveLink(zone?._links, "activate-zone");
    const deactivateZoneLink = resolveLink(zone?._links, "deactivate-zone");

    const updateZoneMutation = useUpdateZoneMutation();
    const activateZoneMutation = useActivateZoneMutation();
    const deactivateZoneMutation = useDeactivateZoneMutation();

    useEffect(() => {
        if (zone) {
            reset({ ...zone });
        }
    }, [zone, reset]);

    const handleOnSubmit = async (value: ZoneFormValues) => {
        if (!editZoneLink) return;
        try {
            await updateZoneMutation.mutateAsync({ link: editZoneLink, request: { ...value } });
            toast.success("Zone updated", { position: "top-center" });
        } catch {
            toast.error("Failed to update zone", { position: "top-center" });
        }
    }

    const handleOnActivate = async () => {
        if (!activateZoneLink) return;
        try {
            await activateZoneMutation.mutateAsync(activateZoneLink);
            toast.success("Zone activated", { position: "top-center" });
        } catch {
            toast.error("Failed to activate zone", { position: "top-center" });
        }
    }

    const handleOnDeactivate = async () => {
        if (!deactivateZoneLink) return;
        try {
            await deactivateZoneMutation.mutateAsync(deactivateZoneLink);
            toast.success("Zone deactivated", { position: "top-center" });
        } catch {
            toast.error("Failed to deactivate zone", { position: "top-center" });
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <Card>
                    <CardContent>
                        <ZoneFieldSet />
                    </CardContent>
                    <CardFooter className="flex justify-end border-t">
                        <ButtonGroup>
                            {activateZoneLink && (
                                <Button type="button" disabled={activateZoneMutation.isPending} onClick={handleOnActivate}>Activate</Button>
                            )}
                            {deactivateZoneLink && (
                                <Button type="button" variant="destructive" disabled={deactivateZoneMutation.isPending} onClick={handleOnDeactivate}>Deactivate</Button>
                            )}
                            {isDirty && editZoneLink && (
                                <Button type="submit" disabled={updateZoneMutation.isPending}>
                                    Update
                                </Button>
                            )}
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}
