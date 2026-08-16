import { useEffect, useId, useRef, useState } from "react";
import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryCreateContext,
  InventoryPayload,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type PlatformEvents,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import ProductInventoryWidget from "./product-inventory-widget";

export type ProductInventoryWidgetExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

export type InventoryWidgetHandle = {
  validate: () => Promise<{
    value?: InventoryPayload;
    errors?: Record<string, string>;
  }>;
  getValues: () => InventoryPayload;
};

function mergeFromHydrate<T extends object>(
  prev: T | undefined,
  current: T | undefined,
  context: Partial<T> | undefined,
): T {
  return { ...prev, ...current, ...context } as T;
}

function resolveMountSnapshot(
  events: PlatformEvents,
  groupId: string,
) {
  const payload = events.getSnapshot("extension:inventory:new:updated:v1", groupId)
    ?.payload;
  const context = events.getSnapshot("extension:inventory:new:hydrate:v1", groupId)
    ?.payload;
  return { payload, context };
}

export default function ProductInventoryWidgetExposed({
  groupId,
  slotId = PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY,
  context,
  platform,
  entryLink,
}: ProductInventoryWidgetExposedProps) {
  const events = platform?.events;
  const ref = useRef<InventoryWidgetHandle>(null);
  const producerId = useId();
  const [payload, setPayload] = useState<InventoryPayload>();
  const [ctx, setContext] = useState<InventoryCreateContext>();

  useEffect(() => {
    if (!groupId) return;
    if (!events) return;

    const snapshot = resolveMountSnapshot(events, groupId);
    const current = ref.current?.getValues();
    if (snapshot.payload || snapshot.context) {
      setPayload((prev) => mergeFromHydrate(prev, current, { ...snapshot.payload, ...snapshot.context }));
    }
    if (snapshot.context) {
      setContext((prev) => ({ ...prev, ...snapshot.context } as InventoryCreateContext));
    }

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

  if (!entryLink || !groupId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <ProductInventoryWidget
          ref={ref}
          context={ctx}
          value={payload}
          onChange={onChange}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
