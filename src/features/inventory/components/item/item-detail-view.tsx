import { useEffect } from "react";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@khinemyaezin/seller-ui/components/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@khinemyaezin/seller-ui/components/tabs";
import {
  PackagePlus,
  SlidersHorizontal,
  ImageIcon,
  AlertTriangle,
  Trash2,
  Undo2,
  ArrowRightLeft,
  ShieldAlert,
  Truck,
  PackageCheck,
  Settings2,
} from "lucide-react";
import { resolveLink } from "@khinemyaezin/seller-api";
import { useItem } from "@/features/inventory/hooks/use-items";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
import ItemReceiveForm from "./item-receive-form";
import ItemAdjustForm from "./item-adjust-form";
import ItemDamageForm from "./item-damage-form";
import ItemWriteOffForm from "./item-write-off-form";
import ItemReturnToVendorForm from "./item-return-to-vendor-form";
import ItemTransferForm from "./item-transfer-form";
import ItemAnnounceInTransitForm from "./item-announce-in-transit-form";
import ItemReceiveInTransitForm from "./item-receive-in-transit-form";
import ItemReorderConfigForm from "./item-reorder-config-form";
import ItemLifecycleActions from "./item-lifecycle-actions";
import ItemMovementsTable from "./item-movements-table";
import ItemReservationsTable from "./item-reservations-table";

export type ItemDetailViewProps = {
  itemId: string;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemDetailView({ itemId, onLifecycleEvent }: ItemDetailViewProps) {
  const itemLink = useInventoryLink("inventoryItem");
  const { data: item } = useItem(itemLink, itemId);

  const receiveLink = resolveLink(item?._links, "receive-inventory-item");
  const adjustLink = resolveLink(item?._links, "adjust-inventory-item");
  const damageLink = resolveLink(item?._links, "damage-inventory-item");
  const writeOffLink = resolveLink(item?._links, "write-off-inventory-item");
  const returnLink = resolveLink(item?._links, "return-inventory-item-to-vendor");
  const transferLink = resolveLink(item?._links, "transfer-inventory-item");
  const announceInTransitLink = resolveLink(item?._links, "announce-in-transit");
  const receiveInTransitLink = resolveLink(item?._links, "receive-in-transit");
  const reorderConfigLink = resolveLink(item?._links, "update-reorder-config");
  const suspendLink = resolveLink(item?._links, "suspend-inventory-item");
  const activateLink = resolveLink(item?._links, "activate-inventory-item");
  const discontinueLink = resolveLink(item?._links, "discontinue-inventory-item");
  const movementsLink = resolveLink(item?._links, "list-inventory-item-movements");
  const reservationsLink = resolveLink(item?._links, "list-inventory-item-reservations");

  const hasInboundActions = !!(receiveLink || announceInTransitLink || receiveInTransitLink);
  const hasCorrectionActions = !!(adjustLink || damageLink || writeOffLink);
  const hasOutboundActions = !!(returnLink || transferLink);
  const hasLifecycleActions = !!(suspendLink || activateLink || discontinueLink);
  const hasQuickActions = hasInboundActions || hasCorrectionActions || hasOutboundActions || !!reorderConfigLink;

  useEffect(() => {
    if (item?.sku) {
      onLifecycleEvent?.({ type: "titleResolved", title: item.sku });
    }
  }, [item?.sku, onLifecycleEvent]);

  if (!item) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading stock item…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex flex-col grow w-full gap-6">
        <Card className="">
          <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex h-full min-w-0 items-center gap-4">
              <div className="flex h-full w-20 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-bold">{item.sku}</span>
                  <Badge variant={item.status === "ACTIVE" ? "success" : "secondary"} className="uppercase text-[10px] px-2 py-0.5">
                    {item.status}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{item.productName || item.sku}</span>
                  {" · "}
                  {item.locationName}
                </p>
              </div>

            </div>
            <div className="flex flex-col gap-3 border-t border-border/50 pt-4 lg:items-end lg:border-t-0 lg:pt-0">
              <div className="flex gap-8">
                <PrimaryStat label="Available" value={item.available} />
                <PrimaryStat label="On Hand" value={item.onHand} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <SecondaryStat label="Reserved" value={item.reserved} />
                <SecondaryStat label="In transit" value={item.inTransit ?? 0} />
                <SecondaryStat label="Damaged" value={item.damaged} />
                <SecondaryStat label="Reorder point" value={item.reorderPoint} />
              </div>
            </div>
          </CardContent>
        </Card>
        {(movementsLink || reservationsLink) && (
          <Card className="w-full">
            <Tabs
              defaultValue={movementsLink ? "movements" : "reservations"}
              className="gap-(--card-spacing)"
            >
              <CardHeader>
                <TabsList>
                  {movementsLink && <TabsTrigger value="movements">Movements</TabsTrigger>}
                  {reservationsLink && <TabsTrigger value="reservations">Reservations</TabsTrigger>}
                </TabsList>
              </CardHeader>
              <CardContent>
                {movementsLink && (
                  <TabsContent value="movements">
                    <ItemMovementsTable link={movementsLink} />
                  </TabsContent>
                )}
                {reservationsLink && (
                  <TabsContent value="reservations">
                    <ItemReservationsTable link={reservationsLink} />
                  </TabsContent>
                )}
              </CardContent>
            </Tabs>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-6">

        {hasQuickActions && (
          <div className="flex flex-col shrink-0 w-full xl:w-80">
            <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {hasInboundActions && <ActionSectionLabel>Inbound</ActionSectionLabel>}
                {receiveLink && (
                  <AccordionItem value="receive">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<PackagePlus className="w-4 h-4 text-muted-foreground" />}
                        title="Receive stock"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Adds quantity with PO, transfer, or return reference.</p>
                        <ItemReceiveForm link={receiveLink} onLifecycleEvent={onLifecycleEvent} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {announceInTransitLink && (
                  <AccordionItem value="announce-in-transit">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<Truck className="w-4 h-4 text-muted-foreground" />}
                        title="Announce inbound"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Track purchase-order quantity still in transit.</p>
                        <ItemAnnounceInTransitForm
                          link={announceInTransitLink}
                          onLifecycleEvent={onLifecycleEvent}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {receiveInTransitLink && (
                  <AccordionItem value="receive-in-transit">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<PackageCheck className="w-4 h-4 text-muted-foreground" />}
                        title="Receive inbound"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Move in-transit quantity onto on-hand stock.</p>
                        <ItemReceiveInTransitForm
                          link={receiveInTransitLink}
                          maxQuantity={item.inTransit ?? 0}
                          onLifecycleEvent={onLifecycleEvent}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {hasCorrectionActions && <ActionSectionLabel>Corrections</ActionSectionLabel>}
                {adjustLink && (
                  <AccordionItem value="adjust">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<SlidersHorizontal className="w-4 h-4 text-muted-foreground" />}
                        title="Adjust on-hand"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Use for correction, cycle count, or shrinkage.</p>
                        <ItemAdjustForm
                          link={adjustLink}
                          currentOnHand={item.onHand}
                          onLifecycleEvent={onLifecycleEvent}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {damageLink && (
                  <AccordionItem value="damage">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<AlertTriangle className="w-4 h-4 text-muted-foreground" />}
                        title="Mark damaged"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Moves units from sellable to damaged.</p>
                        <ItemDamageForm link={damageLink} onLifecycleEvent={onLifecycleEvent} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {writeOffLink && (
                  <AccordionItem value="write-off">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<Trash2 className="w-4 h-4 text-muted-foreground" />}
                        title="Write off"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Permanently remove lost or unrecoverable stock.</p>
                        <ItemWriteOffForm link={writeOffLink} onLifecycleEvent={onLifecycleEvent} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {hasOutboundActions && <ActionSectionLabel>Outbound</ActionSectionLabel>}
                {returnLink && (
                  <AccordionItem value="return-to-vendor">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<Undo2 className="w-4 h-4 text-muted-foreground" />}
                        title="Return to vendor"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Ship available stock back to the vendor.</p>
                        <ItemReturnToVendorForm link={returnLink} onLifecycleEvent={onLifecycleEvent} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {transferLink && (
                  <AccordionItem value="transfer">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<ArrowRightLeft className="w-4 h-4 text-muted-foreground" />}
                        title="Transfer location"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Move available stock to another location.</p>
                        <ItemTransferForm
                          link={transferLink}
                          fromLocationId={item.locationId}
                          maxQuantity={item.available}
                          onLifecycleEvent={onLifecycleEvent}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {reorderConfigLink && <ActionSectionLabel>Settings</ActionSectionLabel>}
                {reorderConfigLink && (
                  <AccordionItem value="reorder-config">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <ActionTrigger
                        icon={<Settings2 className="w-4 h-4 text-muted-foreground" />}
                        title="Reorder settings"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto pt-0 pb-6">
                      <div className="max-w-xl">
                        <p className="text-muted-foreground">Edit safety stock, reorder point, quantity, and max.</p>
                        <ItemReorderConfigForm
                          link={reorderConfigLink}
                          safetyStock={item.safetyStock}
                          reorderPoint={item.reorderPoint}
                          reorderQuantity={item.reorderQuantity}
                          maxStock={item.maxStock}
                          onLifecycleEvent={onLifecycleEvent}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        )}
       {hasLifecycleActions && (
          <Card className="shrink-0 w-full xl:w-80 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger area</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemLifecycleActions
                status={String(item.status)}
                suspendLink={suspendLink}
                activateLink={activateLink}
                discontinueLink={discontinueLink}
                onLifecycleEvent={onLifecycleEvent}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ActionTrigger({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span>{title}</span>
    </div>
  );
}

function ActionSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 pb-1 pt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground first:pt-0">
      {children}
    </div>
  );
}

function PrimaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-3xl font-bold tracking-tight">{value}</span>
    </div>
  );
}

function SecondaryStat({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-xs text-muted-foreground">
      {label} <span className="text-sm font-semibold text-foreground">{value}</span>
    </span>
  );
}
