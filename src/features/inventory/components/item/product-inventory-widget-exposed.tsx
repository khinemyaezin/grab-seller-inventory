import { useEffect, useId, useRef, useState } from "react";
import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { type HateoasLink } from "@khinemyaezin/seller-api";
import {
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
};

function resolveMountSnapshot(
  events: PlatformEvents,
  groupId: string,
): Partial<InventoryPayload> | undefined {
  const own = events.getSnapshot("extension:inventory:updated:v1", groupId)
    ?.payload as InventoryPayload | undefined;
  const identity = events.getSnapshot("extension:inventory:hydrate:v1", groupId)
    ?.payload as Partial<InventoryPayload> | undefined;
  if (!own && !identity) return undefined;
  return { ...own, ...identity };
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
  const [payload, setPayload] = useState<Partial<InventoryPayload>>(
    (context as InventoryPayload),
  );

  useEffect(() => {
    if (!groupId) return;
    if (!events) return;

    const snapshot = resolveMountSnapshot(events, groupId);
    if (snapshot) {
      setPayload((prev) => ({ ...prev, ...snapshot }));
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
      events.subscribe("extension:inventory:hydrate:v1", (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.groupId && msg.groupId !== groupId) return;
        if (msg.slotId && msg.slotId !== slotId) return;
        if (!msg.payload) return;

        setPayload((prev) => ({
          ...prev,
          ...(msg.payload as Partial<InventoryPayload>),
        }));
      }),
      events.subscribe("extension:inventory:updated:v1", (msg) => {
        if (msg.producerId === producerId) return;
        if (msg.groupId !== groupId) return;
        if (!msg.payload) return;
        setPayload((prev) => ({
          ...prev,
          ...(msg.payload as Partial<InventoryPayload>),
        }));
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [events, groupId, slotId, producerId]);

  const onChange = (next: InventoryPayload) => {
    events?.setState("extension:inventory:updated:v1", {
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
          value={payload}
          onChange={onChange}
        />
      </EntryLinkProvider>
    </PlatformProvider>
  );
}
