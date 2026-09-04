import { InventoryCreateContext, InventoryPayload, SellerPlatform } from "@khinemyaezin/seller-contracts";
import { useRef, useId, useState, useEffect } from "react";

export type UseInventoryNewSlotProps = {
    groupId: string,
    slotId: string,
    platform?: SellerPlatform,
    initialContext?: InventoryCreateContext
}

function mergeFromHydrate<T extends object>(
    prev: T | undefined,
    current: T | undefined,
    context: Partial<T> | undefined,
): T {
    return { ...prev, ...current, ...context } as T;
}

export type InventoryWidgetHandle = {
    validate: () => Promise<{
        value?: InventoryPayload;
        errors?: Record<string, string>;
    }>;
    getValues: () => InventoryPayload;
};

export default function useInventoryNewSlot(
    { groupId, slotId, platform, initialContext }: UseInventoryNewSlotProps
) {
    const events = platform?.events;
    const ref = useRef<InventoryWidgetHandle>(null);
    const producerId = useId();

    const [context, setContext] = useState<InventoryCreateContext | undefined>(
        () => (initialContext as InventoryCreateContext) ??
            events?.getSnapshot("extension:inventory:new:hydrate:v1", groupId)?.payload
    );

    const [payload, setPayload] = useState<InventoryPayload | undefined>(
        () => events?.getSnapshot("extension:inventory:new:updated:v1", groupId)?.payload
    );

    useEffect(() => {
        if (!groupId) return;
        if (!events) return;

        const unsubs = [
            events.subscribe("extension:validate:v1", async (msg) => {
                if (msg.producerId === producerId) return;
                if (msg.groupId !== groupId) return;
                if (msg.slotId && msg.slotId !== slotId) return;

                const result = await ref.current?.validate();

                events.emit("extension:validated:v1", {
                    producerId,
                    groupId,
                    slotId,
                    valid: result ? !result.errors : false,
                    ...(result?.errors
                        ? { errors: result.errors, payload: undefined }
                        : { payload: result?.value }),
                });
            }),
            events.subscribe("extension:inventory:new:hydrate:v1", (msg) => {
                if (msg.producerId === producerId) return;
                if (msg.groupId && msg.groupId !== groupId) return;
                if (msg.slotId && msg.slotId !== slotId) return;
                if (!msg.payload) return;

                setContext(msg.payload);
                setPayload((prev) => mergeFromHydrate(prev, ref.current?.getValues(), msg.payload));
            }),
            events.subscribe("extension:inventory:new:updated:v1", (msg) => {
                if (msg.producerId === producerId) return;
                if (msg.groupId !== groupId) return;
                if (!msg.payload) return;

                setPayload(msg.payload);
            }),
        ];

        return () => unsubs.forEach((unsub) => unsub());
    }, [events, groupId, slotId, producerId]);

    const onChange = (next: InventoryPayload) => {
        events?.setState("extension:inventory:new:updated:v1", {
            producerId,
            groupId,
            slotId,
            payload: next,
        });
    };

    return { context, payload, ref, onChange };
}