
import { useUpdateZoneMutation, useActivateZoneMutation, useDeactivateZoneMutation, useZone } from "@/features/inventory/hooks/use-zones";
import type { HateoasLink, ZoneLifecycleEvent } from "@/types";
import type { ZoneFormValues } from "@/features/inventory/types";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ZoneFieldSet from "./zone-fieldset";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { resolveLink } from "@khinemyaezin/seller-api";

export type ZoneEditFormProps = {
    link: HateoasLink,
    id: string,
    onLifecycleEvent?: (event: ZoneLifecycleEvent) => void;
}

const DEFAULT_FORM_VALUES: ZoneFormValues = {
    code: "",
    name: "",
    type: "STORAGE",
    active: true
}

export default function ZoneEditForm({ link, id, onLifecycleEvent }: ZoneEditFormProps) {
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
        if (zone?.name) {
            onLifecycleEvent?.({ type: "titleResolved", title: zone.name });
        }
    }, [zone?.name, onLifecycleEvent]);

    useEffect(() => {
        if (zone) {
            reset({ ...zone });
        }
    }, [zone, reset]);

    const handleOnSubmit = async (value: ZoneFormValues) => {
        if (!editZoneLink) return;
        try {
            await updateZoneMutation.mutateAsync({ link: editZoneLink, request: { ...value } });
            onLifecycleEvent?.({ type: "updated" });
        } catch {
            onLifecycleEvent?.({ type: "updateFailed" });
        }
    }

    const handleOnActivate = async () => {
        if (!activateZoneLink) return;
        try {
            await activateZoneMutation.mutateAsync(activateZoneLink);
            onLifecycleEvent?.({ type: "activated" });
        } catch {
            onLifecycleEvent?.({ type: "activateFailed" });
        }
    }

    const handleOnDeactivate = async () => {
        if (!deactivateZoneLink) return;
        try {
            await deactivateZoneMutation.mutateAsync(deactivateZoneLink);
            onLifecycleEvent?.({ type: "deactivated" });
        } catch {
            onLifecycleEvent?.({ type: "deactivateFailed" });
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
                                <Button type="submit" disabled={updateZoneMutation.isPending || updateZoneMutation.isSuccess}>
                                    <ButtonStatus
                                        status={
                                            updateZoneMutation.isPending
                                                ? "pending"
                                                : updateZoneMutation.isSuccess
                                                    ? "success"
                                                    : "idle"
                                        }
                                        pendingLabel="Saving…"
                                        successLabel="Saved">
                                        Update
                                    </ButtonStatus>
                                </Button>
                            )}
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}
