
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { useCreateBinMutation } from "@/features/inventory/hooks/use-bins";
import { routes } from "@khinemyaezin/seller-contracts";
import type { HateoasLink, BinLifecycleEvent } from "@/types";
import type { BinFormValues } from "@/features/inventory/types";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import BinFieldSet from "./bin-fieldset";

export type BinNewFormProps = {
  link: HateoasLink;
  locationId: string;
  zoneId: string;
  onLifecycleEvent?: (event: BinLifecycleEvent) => void;
};

const DEFAULT_FORM_VALUES: BinFormValues = {
  code: "",
  name: "",
  maxCapacity: 1,
};

export default function BinNewForm({ link, locationId, zoneId, onLifecycleEvent }: BinNewFormProps) {
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
      onLifecycleEvent?.({ type: "created" });
      navigate(routes.zones(locationId));
    } catch {
      onLifecycleEvent?.({ type: "createFailed" });
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
                <Button type="submit" disabled={createBinMutation.isPending || createBinMutation.isSuccess}>
                  <ButtonStatus
                      status={
                          createBinMutation.isPending
                              ? "pending"
                              : createBinMutation.isSuccess
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
  );
}
