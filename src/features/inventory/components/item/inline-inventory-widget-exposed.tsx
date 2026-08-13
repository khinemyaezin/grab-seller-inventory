import { useEffect, useRef, useState } from "react";
import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
  InventoryPayload,
  PRODUCT_EXTENSION_SLOTS,
  type ExtensionMountProps,
  type PlatformEvents,
  type SellerPlatform,
} from "@khinemyaezin/seller-contracts";
import InlineInventoryWidget from "./inline-inventory-widget";

export type InlineInventoryWidgetExposedProps = ExtensionMountProps & {
  entryLink: HateoasLink;
  platform?: SellerPlatform;
};

export type InlineInventoryWidgetHandle = {
  validate: () => Promise<{
    value?: InventoryPayload;
    errors?: Record<string, string>;
  }>;
};

function resolveMountSnapshot(
  events: PlatformEvents,
  instanceId: string,
): Partial<InventoryPayload> | undefined {
  const own = events.getSnapshot("extension:inventory:updated:v1", instanceId)
    ?.payload as InventoryPayload | undefined;
  const identity = events.getSnapshot("extension:inventory:hydrate:v1", instanceId)
    ?.payload as Partial<InventoryPayload> | undefined;
  if (!own && !identity) return undefined;
  return { ...own, ...identity };
}

export default function InlineInventoryWidgetExposed({
  instanceId,
  slotId = PRODUCT_EXTENSION_SLOTS.CREATE_INVENTORY_INLINE,
  context,
  platform,
  entryLink,
}: InlineInventoryWidgetExposedProps) {
  const events = platform?.events;
  const ref = useRef<InlineInventoryWidgetHandle>(null);
  const producerId = instanceId;
  const [payload, setPayload] = useState<Partial<InventoryPayload>>(
    (context as InventoryPayload),
  );

  useEffect(() => {
    if (!instanceId) return;
    if (!events) return;

    const snapshot = resolveMountSnapshot(events, instanceId);
    if (snapshot) {
      setPayload((prev) => ({ ...prev, ...snapshot }));
    }

    const unsubs = [
      events.subscribe("extension:validate:v1", async (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.instanceId !== instanceId) return;
        if (msg.slotId && msg.slotId !== slotId) return;

        const result = await ref.current?.validate();

        events.emit("extension:validated:v1", {
          producerId,
          instanceId,
          slotId,
          valid: result ? !result.errors : false,
          ...(result?.errors
            ? { errors: result.errors, payload: undefined }
            : { payload: result?.value }),
        });
      }),
      events.subscribe("extension:inventory:hydrate:v1", (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.instanceId && msg.instanceId !== instanceId) return;
        if (msg.slotId && msg.slotId !== slotId) return;
        if (!msg.payload) return;

        setPayload((prev) => ({
          ...prev,
          ...(msg.payload as Partial<InventoryPayload>),
        }));
      }),
      events.subscribe("extension:inventory:updated:v1", (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.instanceId !== instanceId) return;
        if (!msg.payload) return;
        setPayload((prev) => ({
          ...prev,
          ...(msg.payload as Partial<InventoryPayload>),
        }));
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [events, instanceId, slotId, producerId]);

  const onChange = (next: InventoryPayload) => {
    events?.setState("extension:inventory:updated:v1", {
      producerId,
      instanceId,
      slotId,
      payload: next,
    });
  };

  if (!entryLink || !instanceId) return null;

  return (
    <PlatformProvider platform={platform}>
      <EntryLinkProvider link={entryLink}>
        <InlineInventoryWidget ref={ref} value={payload} onChange={onChange} />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
