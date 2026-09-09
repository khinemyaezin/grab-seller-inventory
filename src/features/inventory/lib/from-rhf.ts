import { useImperativeHandle, useMemo, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type {
  SlotHandle,
  SlotValueSource,
  SlotWidgetHandle,
} from "@khinemyaezin/seller-contracts";
import { useRegisterSlotHandle } from "@khinemyaezin/seller-ui";
import { collectFormErrors } from "../components/item/inventory-widget-utils";

export function useRhfValueSource<T extends FieldValues>(
  form: UseFormReturn<T>,
): SlotValueSource<T> {
  const formRef = useRef(form);
  formRef.current = form;
  return useMemo(
    () => ({
      getValues: () => formRef.current.getValues(),
      subscribe: (onFieldChange) => {
        const sub = formRef.current.watch((_v, info) =>
          onFieldChange(info.name),
        );
        return () => sub.unsubscribe();
      },
    }),
    [],
  );
}

export function useRhfSlotHandle<T extends FieldValues>(
  form: UseFormReturn<T>,
  registerHandle: ((handle: SlotHandle<T>) => void | (() => void)) | undefined,
  getBaseline: () => T,
  onChange?: (value: T) => void,
) {
  const ref = useRef<SlotWidgetHandle<T>>(null);
  const getBaselineRef = useRef(getBaseline);
  getBaselineRef.current = getBaseline;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useRegisterSlotHandle(ref, registerHandle);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const isValid = await form.trigger();
      if (isValid) return { value: form.getValues() };
      return { errors: collectFormErrors(form.formState.errors) };
    },
    getValues: () => form.getValues(),
    reset: () => {
      const baseline = getBaselineRef.current();
      form.reset(baseline);
      onChangeRef.current?.(baseline);
    },
  }));
}
