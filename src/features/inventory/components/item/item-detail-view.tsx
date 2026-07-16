import { useEffect } from "react";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@khinemyaezin/seller-ui/components/accordion";
import { PackagePlus, SlidersHorizontal } from "lucide-react";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-3 items-center">
            <span>{item.sku}</span>
            <Badge variant={item.status === "ACTIVE" ? "success" : "secondary"}>
              {item.status}
            </Badge>
          </CardTitle>
          <CardDescription>{item.locationName}</CardDescription>

        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5">
            <div className="space-y-3">
              <dt className="text-muted-foreground">On hand</dt>
              <dd className="text-lg font-semibold leading-none">{item.onHand}</dd>
            </div>
            <div className="space-y-3">
              <dt className="text-muted-foreground">Available</dt>
              <dd className="text-lg font-semibold leading-none">{item.available}</dd>
            </div>
            <div className="space-y-3">
              <dt className="text-muted-foreground">Reserved</dt>
              <dd className="text-lg font-semibold leading-none">{item.reserved}</dd>
            </div>
            <div className="space-y-3">
              <dt className="text-muted-foreground">Damaged</dt>
              <dd className="text-lg font-semibold leading-none">{item.damaged}</dd>
            </div>
            <div className="space-y-3">
              <dt className="text-muted-foreground">Reorder point</dt>
              <dd className="text-lg font-semibold leading-none">{item.reorderPoint}</dd>
            </div>
          </div>
        </CardContent>
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
