
import { useUpdateBinMutation, useActivateBinMutation, useDeactivateBinMutation, useBin } from "@/features/inventory/hooks/use-bins";
import type { HateoasLink } from "@/types";
import type { BinFormValues } from "@/features/inventory/types";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import BinFieldSet from "./bin-fieldset";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { resolveLink } from "@khinemyaezin/seller-api";

export type BinEditFormProps = {
  link: HateoasLink;
  id: string;
};

const DEFAULT_FORM_VALUES: BinFormValues = {
  code: "",
  name: "",
  maxCapacity: 1,
};

export default function BinEditForm({ link, id }: BinEditFormProps) {
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
    if (bin) {
      reset({ code: bin.code, name: bin.name, maxCapacity: bin.maxCapacity, active: bin.active });
    }
  }, [bin, reset]);

  const handleOnSubmit = async (value: BinFormValues) => {
    if (!editBinLink) return;
    try {
      await updateBinMutation.mutateAsync({ link: editBinLink, request: { ...value } });
      toast.success("Bin updated", { position: "top-center" });
    } catch {
      toast.error("Failed to update bin", { position: "top-center" });
    }
  };

  const handleOnActivate = async () => {
    if (!activateBinLink) return;
    try {
      await activateBinMutation.mutateAsync(activateBinLink);
      toast.success("Bin activated", { position: "top-center" });
    } catch {
      toast.error("Failed to activate bin", { position: "top-center" });
    }
  };

  const handleOnDeactivate = async () => {
    if (!deactivateBinLink) return;
    try {
      await deactivateBinMutation.mutateAsync(deactivateBinLink);
      toast.success("Bin deactivated", { position: "top-center" });
    } catch {
      toast.error("Failed to deactivate bin", { position: "top-center" });
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
                <Button type="submit" disabled={updateBinMutation.isPending}>
                  Update
                </Button>
              )}
            </ButtonGroup>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
