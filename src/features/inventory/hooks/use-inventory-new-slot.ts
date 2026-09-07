import {
    InventoryCreateContext,
    InventoryPayload,
    type SlotHandle,
} from "@khinemyaezin/seller-contracts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    mergeFromHydrate,
    useRegisterSlotHandle,
    type SlotWidgetHandle,
} from "@khinemyaezin/seller-ui";

export type UseInventoryNewSlotProps = {
    groupId: string;
    slotId: string;
    context?: InventoryCreateContext;
    initialValue?: InventoryPayload;
    onChange?: (value: InventoryPayload) => void;
    registerHandle?: (handle: SlotHandle<InventoryPayload>) => void | (() => void);
};

export type InventoryWidgetHandle = SlotWidgetHandle<InventoryPayload>;

export default function useInventoryNewSlot({
    context,
    initialValue,
    onChange,
    registerHandle,
}: UseInventoryNewSlotProps) {
    const ref = useRef<InventoryWidgetHandle>(null);
    const [payload, setPayload] = useState<InventoryPayload | undefined>(initialValue);
    const payloadRef = useRef(payload);
    payloadRef.current = payload;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useRegisterSlotHandle(ref, registerHandle);

    const sku = context?.sku;

    useEffect(() => {
        if (sku === undefined) return;
        const prev = payloadRef.current;
        if (prev?.sku === sku) return;

        const next = mergeFromHydrate(prev, ref.current?.getValues(), { sku });
        payloadRef.current = next;
        setPayload(next);
        onChangeRef.current?.(next);
    }, [sku]);

    const handleChange = useCallback((next: InventoryPayload) => {
        payloadRef.current = next;
        setPayload(next);
        onChangeRef.current?.(next);
    }, []);

    return { context, payload, ref, onChange: handleChange };
}
