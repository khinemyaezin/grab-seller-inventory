
import { useUpdateBinMutation, useActivateBinMutation, useDeactivateBinMutation, useBin } from "@/features/inventory/hooks/use-bins";
import type { HateoasLink, BinLifecycleEvent } from "@/types";
import type { BinFormValues } from "@/features/inventory/types";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BinFieldSet from "./bin-fieldset";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { resolveLink } from "@khinemyaezin/seller-api";

export type BinEditFormProps = {
  link: HateoasLink;
  id: string;
  onLifecycleEvent?: (event: BinLifecycleEvent) => void;
};

const DEFAULT_FORM_VALUES: BinFormValues = {
  code: "",
  name: "",
  maxCapacity: 1,
};

export default function BinEditForm({ link, id, onLifecycleEvent }: BinEditFormProps) {
  const form = useForm<BinFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const { handleSubmit, formState: { isDirty }, reset } = form;
  const { data: bin } = useBin(link, id);
  const editBinLink = resolveLink(bin?._links, "edit-bin");
  const activateBinLink = resolveLink(bin?._links, "activate-bin");
  const deactivateBinLink = resolveLink(bin?._links, "deactivate-bin");

  const updateBinMutation = useUpdateBinMutation();
  const activateBinMutation = useActivateBinMutation();
  const deactivateBinMutation = useDeactivateBinMutation();

  useEffect(() => {
    if (bin?.name) {
      onLifecycleEvent?.({ type: "titleResolved", title: bin.name });
    }
  }, [bin?.name, onLifecycleEvent]);

  useEffect(() => {
    if (bin) {
      reset({ code: bin.code, name: bin.name, maxCapacity: bin.maxCapacity, active: bin.active });
    }
  }, [bin, reset]);

  const handleOnSubmit = async (value: BinFormValues) => {
    if (!editBinLink) return;
    try {
      await updateBinMutation.mutateAsync({ link: editBinLink, request: { ...value } });
      onLifecycleEvent?.({ type: "updated" });
    } catch {
      onLifecycleEvent?.({ type: "updateFailed" });
    }
  };

  const handleOnActivate = async () => {
    if (!activateBinLink) return;
    try {
      await activateBinMutation.mutateAsync(activateBinLink);
      onLifecycleEvent?.({ type: "activated" });
    } catch {
      onLifecycleEvent?.({ type: "activateFailed" });
    }
  };

  const handleOnDeactivate = async () => {
    if (!deactivateBinLink) return;
    try {
      await deactivateBinMutation.mutateAsync(deactivateBinLink);
      onLifecycleEvent?.({ type: "deactivated" });
    } catch {
      onLifecycleEvent?.({ type: "deactivateFailed" });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Card>
          <CardContent>
            <BinFieldSet />
          </CardContent>
          <CardFooter className="flex justify-end border-t">
            <ButtonGroup>
              {activateBinLink && (
                <Button type="button" disabled={activateBinMutation.isPending} onClick={handleOnActivate}>Activate</Button>
              )}
              {deactivateBinLink && (
                <Button type="button" variant="destructive" disabled={deactivateBinMutation.isPending} onClick={handleOnDeactivate}>Deactivate</Button>
              )}
              {isDirty && editBinLink && (
                <Button type="submit" disabled={updateBinMutation.isPending || updateBinMutation.isSuccess}>
                  <ButtonStatus
                    status={
                      updateBinMutation.isPending
                        ? "pending"
                        : updateBinMutation.isSuccess
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
  );
}
