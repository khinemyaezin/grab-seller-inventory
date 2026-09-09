import { useCallback, useEffect, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InventoryPayloadSchema,
  type InventoryCreateContext,
  type InventoryPayload,
  type SlotHandle,
} from "@khinemyaezin/seller-contracts";
import { useSlotChangeEmitter } from "@khinemyaezin/seller-ui";
import { useRhfSlotHandle, useRhfValueSource } from "../../lib/from-rhf";

const schema = z.fromJSONSchema(InventoryPayloadSchema) as z.ZodType<
  InventoryPayload,
  InventoryPayload
>;

const DEFAULT_VALUE: InventoryPayload = {
  sku: "",
  locations: [],
};

export type InventoryCreateFormProps = {
  context?: InventoryCreateContext;
  defaultValues?: InventoryPayload;
  onValuesChange?: (values: InventoryPayload) => void;
  registerHandle?: (handle: SlotHandle<InventoryPayload>) => void | (() => void);
  children: ReactNode;
};

export function InventoryCreateForm({
  context,
  defaultValues,
  onValuesChange,
  registerHandle,
  children,
}: InventoryCreateFormProps) {
  const form = useForm<InventoryPayload>({
    defaultValues: {
      ...(defaultValues ?? DEFAULT_VALUE),
      ...(context?.sku !== undefined ? { sku: context.sku } : {}),
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { setValue, getValues } = form;
  const contextSku = context?.sku;

  useEffect(() => {
    if (contextSku === undefined) return;
    if (getValues("sku") === contextSku) return;
    setValue("sku", contextSku, { shouldDirty: true });
  }, [contextSku, setValue, getValues]);

  const source = useRhfValueSource(form);
  useSlotChangeEmitter(source, onValuesChange);

  const getBaseline = useCallback((): InventoryPayload => {
    const mounted = form.formState.defaultValues;
    return {
      sku: contextSku ?? mounted?.sku ?? "",
      locations: (mounted?.locations ?? []) as InventoryPayload["locations"],
    };
  }, [contextSku, form.formState.defaultValues]);

  useRhfSlotHandle(form, registerHandle, getBaseline, onValuesChange);

  return <FormProvider {...form}>{children}</FormProvider>;
}
