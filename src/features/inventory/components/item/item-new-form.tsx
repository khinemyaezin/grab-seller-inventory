import {
  ApiError,
  CreateInventoryRequest,
  ItemFormValues,
  ItemLifecycleEvent,
} from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { ItemBasicFieldSet } from "./item-fieldset";
import { useCreateItemMutation } from "@/features/inventory/hooks/use-items";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { usePlatform } from "@khinemyaezin/seller-ui";
import { useSearchParams } from "react-router";

export type ItemNewFormProps = {
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemNewForm({ onLifecycleEvent }: ItemNewFormProps) {
  const createItemLink = useInventoryLink("createInventoryItem");
  const platform = usePlatform();
  const [searchParams] = useSearchParams();

  const defaultValues: ItemFormValues = {
    product: { sku: "", productName: ""},
    locationId: searchParams.get("locationId") ?? "",
    productVariantId: searchParams.get("productVariantId") ?? "",
    initialQuantity: 0,
    safetyStock: 0,
    reorderPoint: 0,
    reorderQuantity: 0,
    maxStock: "",
  };

  const form = useForm<ItemFormValues>({
    defaultValues,
    mode: "onSubmit",
  });
  const { handleSubmit, reset, formState: { isDirty } } = form;
  const createItemMutation = useCreateItemMutation();

  const handleFormSubmit = (values: ItemFormValues) => {
    if (!createItemLink) return;

    const maxStockValue = values.maxStock === "" ? undefined : Number(values.maxStock);
    const payload: CreateInventoryRequest = {
      sku: values.product.sku.trim(),
      locationId: values.locationId,
      productVariantId: values.productVariantId.trim() || undefined,
      initialQuantity: values.initialQuantity,
      safetyStock: values.safetyStock || undefined,
      reorderPoint: values.reorderPoint || undefined,
      reorderQuantity: values.reorderQuantity || undefined,
      maxStock: Number.isFinite(maxStockValue) ? maxStockValue : undefined,
    };

    createItemMutation
      .mutateAsync({ link: createItemLink, request: payload })
      .then(() => {
        reset(defaultValues);
        createItemMutation.reset();
        onLifecycleEvent?.({ type: "created" });
      })
      .catch((e) => {
        onLifecycleEvent?.({ type: "createFailed", message: (e instanceof ApiError) ?( e.data as any).detail : "Failed"});
      });
  };

  if (!createItemLink) return null;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
          <CardContent>
            <ItemBasicFieldSet />
          </CardContent>
          {isDirty && (
            <CardFooter className="flex justify-end">
              <ButtonGroup>
                <Button
                  type="submit"
                  disabled={createItemMutation.isPending || createItemMutation.isSuccess}
                >
                  <ButtonStatus
                    status={
                      createItemMutation.isPending
                        ? "pending"
                        : createItemMutation.isSuccess
                          ? "success"
                          : "idle"
                    }
                    pendingLabel="Saving…"
                    successLabel="Saved"
                  >
                    Save
                  </ButtonStatus>
                </Button>
              </ButtonGroup>
            </CardFooter>
          )}
        </Card>
      </form>
    </FormProvider>
  );
}
