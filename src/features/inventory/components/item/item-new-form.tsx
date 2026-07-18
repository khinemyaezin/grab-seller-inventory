import {
  ApiError,
  CreateInventoryRequest,
  ItemFormValues,
  ItemLifecycleEvent,
} from "@/types";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateItemMutation } from "@/features/inventory/hooks/use-items";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import { useSearchParams } from "react-router";
import { Button, ButtonGroup, ButtonStatus, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FieldDescription, FieldLegend, FieldSet, Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle, WizardStep } from "@khinemyaezin/seller-ui/components/index";
import Wizard from "@khinemyaezin/seller-ui/components/wizard";
import { ItemLocationFieldSet, ItemProductVariantFieldSet, ItemStockSettingsFieldSet } from "./item-fieldset";
import { ArrowLeftIcon, ArrowRightIcon, MapPin, Package, PencilIcon } from "lucide-react";

export type ItemNewFormProps = {
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

type PickerStep = "location" | "product";
type FormPhase = "picker" | "stock";

const PICKER_STEP_ORDER: PickerStep[] = ["location", "product"];

export default function ItemNewForm({ onLifecycleEvent }: ItemNewFormProps) {
  const createItemLink = useInventoryLink("createInventoryItem");
  const searchLocationLink = useInventoryLink("searchLocation");
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<FormPhase>("picker");
  const [pickerStepId, setPickerStepId] = useState<PickerStep>("location");

  const defaultValues: ItemFormValues = {
    product: { sku: "", productName: "" },
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

  const { handleSubmit, reset, watch, formState: { isDirty } } = form;
  const locationId = watch("locationId");
  const product = watch("product");
  const productSku = product?.sku?.trim() ?? "";

  const { data: locationsData } = useLocations(searchLocationLink, {
    page: 0,
    size: 100
  });
  const selectedLocation = locationsData?._embedded?.locationResponseList?.find(
    (location) => location.id === locationId,
  );

  const createItemMutation = useCreateItemMutation();
  const pickerStepIndex = PICKER_STEP_ORDER.indexOf(pickerStepId);

  const handlePickerNext = () => {
    const nextIndex = pickerStepIndex + 1;
    if (nextIndex < PICKER_STEP_ORDER.length) {
      setPickerStepId(PICKER_STEP_ORDER[nextIndex]);
    } else {
      setPhase("stock");
    }
  };

  const handlePickerBack = () => {
    const previousIndex = Math.max(0, pickerStepIndex - 1);
    setPickerStepId(PICKER_STEP_ORDER[previousIndex]);
  };

  const openPickerToEdit = () => {
    handlePickerBack();
    setPhase("picker");
  };

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
        onLifecycleEvent?.({
          type: "createFailed",
          message: e instanceof ApiError ? (e.data as any).detail : "Failed",
        });
      });
  };

  const buttons = (
    <div className="flex justify-end gap-2 pt-6">
      <Button type="button" variant="secondary" onClick={handlePickerBack}>
        <ArrowLeftIcon />
      </Button>
    </div>
  );

  const pickerSteps: WizardStep<PickerStep>[] = [
    {
      id: "location",
      title: "Select location",
      description: "Choose where this SKU will be stocked",
      content: (
        <div className="p-6 pt-0">
          <ItemLocationFieldSet onSelected={async () => {
            handlePickerNext();
          }} />
        </div>
      ),
    },
    {
      id: "product",
      title: "Choose product variant",
      description: "Pick an available catalog variant for this location.",
      content: (
        <div className="p-6 pt-0">
          <ItemProductVariantFieldSet onSelected={async (inventoryItemId) => {
            if (inventoryItemId) {
              onLifecycleEvent?.({ type: "navigation", itemId: inventoryItemId });
              return;
            }
            handlePickerNext();
          }} />
          {buttons}
        </div>),
    },
  ];

  if (!createItemLink) return null;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {phase === "picker" ? (
          <Wizard steps={pickerSteps} activeStepId={pickerStepId}>
          </Wizard>
        ) : (
          <>
            <Card>
              <CardContent className="flex items-start justify-between gap-3">
                <ItemGroup>
                  <Item className="p-0">
                    <ItemMedia className="bg-secondary" variant="image">
                      <MapPin className="size-4 text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{selectedLocation?.name ?? "Location"}</ItemTitle>
                      <ItemDescription>
                        {[selectedLocation?.code, selectedLocation?.address?.city]
                          .filter(Boolean)
                          .join(" · ") || locationId}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                  <Item className="p-0">
                    <ItemMedia className="bg-secondary" variant="image">
                      <Package className="size-4 text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{productSku}</ItemTitle>
                      <ItemDescription>
                        {product.productName}
                      </ItemDescription>
                    </ItemContent>

                  </Item>
                </ItemGroup>
                <Button type="button" variant="ghost" size="sm" onClick={openPickerToEdit}>
                  <PencilIcon className="size-4" />
                  Edit
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock settings</CardTitle>
                <CardDescription>Set the opening quantity and optional replenishment thresholds.</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemStockSettingsFieldSet />
              </CardContent>
              {isDirty && (
                <CardFooter className="flex justify-end">
                  <ButtonGroup>
                    <Button type="submit">
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
                        Create
                      </ButtonStatus>
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              )}
            </Card>
          </>
        )}
      </form>
    </FormProvider>
  );
}
