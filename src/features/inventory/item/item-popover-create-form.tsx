import { useCallback, useEffect, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InventoryPayloadSchema,
  type InventoryPayload,
  type SlotHandle,
} from "@khinemyaezin/seller-contracts";
import { useSlotChangeEmitter, useRhfSlotHandle, useRhfValueSource } from "@khinemyaezin/seller-ui";
import { projectInventoryCreate } from "@/features/inventory/lib/project-inventory";

const schema = z.fromJSONSchema(InventoryPayloadSchema) as z.ZodType<
  InventoryPayload,
  InventoryPayload
>;

const DEFAULT_VALUE: InventoryPayload = {
  sku: "",
  locations: [],
};

export type InventoryCreateFormProps = {
  seed?: InventoryPayload;
  contextSku?: string;
  onValuesChange?: (values: InventoryPayload) => void;
  registerHandle?: (handle: SlotHandle<InventoryPayload>) => void | (() => void);
  children: ReactNode;
};

export function ItemPopoverCreateForm({
  seed,
  contextSku,
  onValuesChange,
  registerHandle,
  children,
}: InventoryCreateFormProps) {
  const form = useForm<InventoryPayload>({
    defaultValues: seed ?? DEFAULT_VALUE,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { setValue, getValues } = form;

  useEffect(() => {
    if (contextSku !== undefined && getValues("sku") !== contextSku) {
      setValue("sku", contextSku, { shouldDirty: false });
    }
  }, [contextSku, setValue, getValues]);

  const source = useRhfValueSource<InventoryPayload>(form);
  useSlotChangeEmitter(source, onValuesChange);

  const getBaseline = useCallback((): InventoryPayload => {
    return seed ?? DEFAULT_VALUE;
  }, [seed]);

  useRhfSlotHandle<InventoryPayload>(form, {
    registerHandle,
    getBaseline,
    onChange: onValuesChange,
    project: projectInventoryCreate,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
