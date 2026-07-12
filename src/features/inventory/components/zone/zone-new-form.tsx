
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { useAddZoneMutation } from "@/features/inventory/hooks/use-zones";
import { HateoasLink } from "@/types";
import { ZoneFormValues } from "@/features/inventory/types";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import ZoneFieldSet from "./zone-fieldset";

export type ZoneNewFormProps = {
    link: HateoasLink,
    locationId: string
}

const DEFAULT_FORM_VALUES: ZoneFormValues = {
    code: "",
    name: "",
    type: "STORAGE",
    active: true
}

export default function ZoneNewForm({ link }: ZoneNewFormProps) {
    const form = useForm<ZoneFormValues>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: "onSubmit",
    });

    const { handleSubmit, formState: { isDirty } } = form;
    const createZoneMutation = useAddZoneMutation()

    const handleOnSubmit = async (value: ZoneFormValues) => {
        if(!link) return;
        try {
            await createZoneMutation.mutateAsync({ link: link, request: { ...value } });
            toast.success("Zone created", { position: "top-center" });
        } catch {
            toast.error("Failed to create zone", { position: "top-center" });
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <Card>
                    <CardContent>
                        <ZoneFieldSet />
                    </CardContent>
                    <CardFooter>
                        <ButtonGroup>
                            {isDirty && (
                                <Button type="submit" disabled={createZoneMutation.isPending}>
                                    Save
                                </Button>
                            )}
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}