import { useEffect } from "react";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@khinemyaezin/seller-ui/components/accordion";
import { PackagePlus, SlidersHorizontal, ImageIcon, Package, CheckCircle2, Bookmark, AlertTriangle, RefreshCw, Copy } from "lucide-react";
import { resolveLink } from "@khinemyaezin/seller-api";
import { useItem } from "@/features/inventory/hooks/use-items";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
import ItemReceiveForm from "./item-receive-form";
import ItemAdjustForm from "./item-adjust-form";
import ItemMovementsTable from "./item-movements-table";

export type ItemDetailViewProps = {
  itemId: string;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

export default function ItemDetailView({ itemId, onLifecycleEvent }: ItemDetailViewProps) {
  const itemLink = useInventoryLink("inventoryItem");
  const { data: item } = useItem(itemLink, itemId);

  const receiveLink = resolveLink(item?._links, "receive-inventory-item");
  const adjustLink = resolveLink(item?._links, "adjust-inventory-item");
  const movementsLink = resolveLink(item?._links, "list-inventory-item-movements");

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
    <div className="grid gap-6">
      <Card className="flex flex-col lg:flex-row items-start lg:items-center p-4 sm:p-6 gap-6 sm:gap-8">
        <div className="flex w-full flex-col sm:flex-row shrink-0 items-start sm:items-center gap-4 sm:gap-6 border-b border-border/50 pb-6 lg:w-auto lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="flex h-20 w-20 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-xl p-2 bg-secondary">
            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl font-bold">{item.sku}</span>
                <Badge variant={item.status === "ACTIVE" ? "success" : "secondary"} className="uppercase text-[10px] px-2 py-0.5">
                  {item.status}
                </Badge>
              </div>
              <div className="space-y-0.5 text-muted-foreground">
                <div className="font-medium text-foreground">{item.productName || item.sku}</div>
                <div className="text-sm">{item.locationName}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                {item.sku}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-5 lg:flex-1">
          <StatBlock label="On Hand" value={item.onHand} />
          <StatBlock label="Available" value={item.available} />
          <StatBlock label="Reserved" value={item.reserved} />
          <StatBlock label="Damaged" value={item.damaged} />
          <StatBlock label="Reorder Point" value={item.reorderPoint} />
        </div>
      </Card>


      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {movementsLink && (
          <div className="flex-1 min-w-0 w-full">
            <ItemMovementsTable link={movementsLink} />
          </div>
        )}
        <div className="flex flex-col shrink-0 w-full xl:w-96">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {receiveLink && (
                  <AccordionItem value="receive">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-4 text-left">
                        <PackagePlus className="w-5 h-5 mt-0.5 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="font-medium leading-none">Receive stock</p>
                          <p className="text-sm text-muted-foreground font-normal">Adds quantity with PO, transfer, or return reference.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto py-7 pt-0">
                      <ItemReceiveForm link={receiveLink} onLifecycleEvent={onLifecycleEvent} />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {adjustLink && (
                  <AccordionItem value="adjust">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-4 text-left">
                        <SlidersHorizontal className="w-5 h-5 mt-0.5 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="font-medium leading-none">Adjust on-hand</p>
                          <p className="text-sm text-muted-foreground font-normal">Use for correction, cycle count, damage, or shrinkage.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="!h-auto py-7 pt-0">
                      <ItemAdjustForm
                        link={adjustLink}
                        currentOnHand={item.onHand}
                        onLifecycleEvent={onLifecycleEvent}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="flex flex-col items-center space-y-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground">units</span>
      </div>
    </div>
  );
}
