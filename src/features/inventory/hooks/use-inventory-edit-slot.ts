import {
  InventoryEditContext,
  InventoryEditPayload,
  SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import { useRef, useId, useState, useEffect, useCallback } from "react";

export type InventoryEditWidgetHandle = {
  validate: () => Promise<{
    value?: InventoryEditPayload;
    errors?: Record<string, string>;
  }>;
  getValues: () => InventoryEditPayload;
};

export type UseInventoryEditSlotProps = {
  groupId: string;
  slotId: string;
  platform?: SellerPlatform;
  initialContext?: InventoryEditContext;
};

function mergeFromHydrate<T extends object>(
  prev: T | undefined,
  current: T | undefined,
  context: Partial<T> | undefined,
): T {
  return { ...prev, ...current, ...context } as T;
}

function sameContext(
  prev: InventoryEditContext | undefined,
  next: InventoryEditContext | undefined,
) {
  return prev?.variantId === next?.variantId && prev?.sku === next?.sku;
}

export default function useInventoryEditSlot({
  groupId,
  slotId,
  platform,
  initialContext,
}: UseInventoryEditSlotProps) {
  const events = platform?.events;
  const ref = useRef<InventoryEditWidgetHandle>(null);
  const producerId = useId();

  const [context, setContext] = useState<InventoryEditContext | undefined>(
    () =>
      initialContext ??
      events?.getSnapshot("extension:inventory:edit:hydrate:v1", groupId)?.payload,
  );

  const [payload, setPayload] = useState<InventoryEditPayload | undefined>(
    () => events?.getSnapshot("extension:inventory:edit:updated:v1", groupId)?.payload,
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
      events.subscribe("extension:inventory:edit:hydrate:v1", (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.groupId && msg.groupId !== groupId) return;
        if (msg.slotId && msg.slotId !== slotId) return;
        if (!msg.payload) return;

        setContext((prev) => (sameContext(prev, msg.payload) ? prev : msg.payload));
        setPayload((prev) => {
          if (
            prev &&
            prev.sku === (msg.payload.sku ?? "") &&
            prev.variantId === msg.payload.variantId
          ) {
            return prev;
          }
          return mergeFromHydrate(prev, ref.current?.getValues(), {
            sku: msg.payload.sku,
            variantId: msg.payload.variantId,
          });
        });
      }),
      events.subscribe("extension:inventory:edit:updated:v1", (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.groupId !== groupId) return;
        if (!msg.payload) return;

        setPayload(msg.payload);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [events, groupId, slotId, producerId]);

  const onChange = useCallback(
    (next: InventoryEditPayload) => {
      events?.setState("extension:inventory:edit:updated:v1", {
        producerId,
        groupId,
        slotId,
        payload: next,
      });
    },
    [events, producerId, groupId, slotId],
  );

  return { context, payload, ref, onChange };
}
