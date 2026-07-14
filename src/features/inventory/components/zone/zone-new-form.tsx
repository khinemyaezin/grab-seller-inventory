
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { useAddZoneMutation } from "@/features/inventory/hooks/use-zones";
import { HateoasLink, ZoneLifecycleEvent } from "@/types";
import { ZoneFormValues } from "@/features/inventory/types";
import { FormProvider, useForm } from "react-hook-form";
import ZoneFieldSet from "./zone-fieldset";

export type ZoneNewFormProps = {
    link: HateoasLink,
    locationId: string,
    onLifecycleEvent?: (event: ZoneLifecycleEvent) => void;
}

const DEFAULT_FORM_VALUES: ZoneFormValues = {
    code: "",
    name: "",
    type: "STORAGE",
    active: true
}

export default function ZoneNewForm({ link, onLifecycleEvent }: ZoneNewFormProps) {
    const form = useForm<ZoneFormValues>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: "onSubmit",
    });

    const { handleSubmit, reset, formState: { isDirty } } = form;
    const createZoneMutation = useAddZoneMutation()

    const handleOnSubmit = async (value: ZoneFormValues) => {
        if(!link) return;
        try {
            await createZoneMutation.mutateAsync({ link: link, request: { ...value } });
            reset(DEFAULT_FORM_VALUES);
            onLifecycleEvent?.({ type: "created" });
        } catch {
            onLifecycleEvent?.({ type: "createFailed" });
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <Card>
                    <CardContent>
                        <ZoneFieldSet />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <ButtonGroup>
                            {isDirty && (
                                <Button type="submit" disabled={createZoneMutation.isPending || createZoneMutation.isSuccess}>
                                    <ButtonStatus
                                        status={
                                            createZoneMutation.isPending
                                                ? "pending"
                                                : createZoneMutation.isSuccess
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
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}