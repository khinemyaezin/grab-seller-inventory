
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { useCreateBinMutation } from "@/features/inventory/hooks/use-bins";
import { routes } from "@khinemyaezin/seller-contracts";
import type { HateoasLink } from "@/types";
import type { BinFormValues } from "@/features/inventory/types";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import BinFieldSet from "./bin-fieldset";

export type BinNewFormProps = {
  link: HateoasLink;
  locationId: string;
  zoneId: string;
};

const DEFAULT_FORM_VALUES: BinFormValues = {
  code: "",
  name: "",
  maxCapacity: 1,
};

export default function BinNewForm({ link, locationId, zoneId }: BinNewFormProps) {
  const navigate = useNavigate();
  const form = useForm<BinFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const { handleSubmit, formState: { isDirty } } = form;
  const createBinMutation = useCreateBinMutation();

  const handleOnSubmit = async (value: BinFormValues) => {
    if (!link) return;
    try {
      await createBinMutation.mutateAsync({ link, request: { ...value, zoneId } });
      toast.success("Bin created", { position: "top-center" });
      navigate(routes.zones(locationId));
    } catch {
      toast.error("Failed to create bin", { position: "top-center" });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Card>
          <CardContent>
            <BinFieldSet />
          </CardContent>
          <CardFooter>
            <ButtonGroup>
              {isDirty && (
                <Button type="submit" disabled={createBinMutation.isPending}>
                  Save
                </Button>
              )}
            </ButtonGroup>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
