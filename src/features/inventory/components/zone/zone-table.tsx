
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { BoxesIcon, LayersIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { Link, useSearchParams } from "react-router";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";
import { useZones, useActivateZoneMutation, useDeactivateZoneMutation, useRemoveZoneMutation } from "@/features/inventory/hooks/use-zones";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@khinemyaezin/seller-ui/components/accordion";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu, DropdownMenuSeparator } from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { BinTable } from "@/features/inventory/components/bin/bin-table";

type ZoneTableProps = {
  locationId: string,
  link: HateoasLink
  onPageChange?: (page: number) => void;
  onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
};

export function ZoneTable({
  locationId,
  link,
  onLifecycleEvent
}: ZoneTableProps) {
  const { data: zones } = useZones(link, locationId);
  const activateMutation = useActivateZoneMutation();
  const deactivateMutation = useDeactivateZoneMutation();
  const deleteMutation = useRemoveZoneMutation();

  const handleActivate = async (link: HateoasLink, messages: { success: string; error: string }) => {
    try {
      await activateMutation.mutateAsync(link);
      onLifecycleEvent?.({ type: "activated" });
    } catch {
      onLifecycleEvent?.({ type: "activateFailed" });
    }
  };

  const handleDeactivate = async (link: HateoasLink, messages: { success: string; error: string }) => {
    try {
      await deactivateMutation.mutateAsync(link);
      onLifecycleEvent?.({ type: "deactivated" });
    } catch {
      onLifecycleEvent?.({ type: "deactivateFailed" });
    }
  };

  const handleDelete = async (link: HateoasLink, messages: { success: string; error: string }) => {
    try {
      await deleteMutation.mutateAsync(link);
      onLifecycleEvent?.({ type: "deleted" });
    } catch {
      onLifecycleEvent?.({ type: "deleteFailed" });
    }
  };

  const zoneList = zones?._embedded?.zoneResponseList ?? [];
  const [searchParams, setSearchParams] = useSearchParams();
  const activeParam = searchParams.get("active");

  const handleAccordionChange = (val: string) => {
    if (val) {
      searchParams.set("active", val);
    } else {
      searchParams.delete("active");
    }
    setSearchParams(searchParams, { replace: true });
  };

  if (zoneList.length === 0) {
    return (
      <div className="border-t px-6 py-10 text-center">
        <p className="text-sm font-medium">No zones yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add zones to group bins by picking, storage, staging, or receiving flow.
        </p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={activeParam || ""}
      onValueChange={handleAccordionChange}
    >
      {zoneList.map((zone: ZoneResponse) => {
        const pagedBinLink = resolveLink(zone._links, "paged-bin");
        const createBinLink = resolveLink(zone._links, "create-bin");
        const activateLink = resolveLink(zone._links, "activate-zone");
        const deactivateLink = resolveLink(zone._links, "deactivate-zone");
        const deleteLink = resolveLink(zone._links, "delete-zone");

        return (
          <AccordionItem value={zone.id} key={zone.id} className="group border-b last:border-b-0">
            <div className="flex items-center gap-2 px-6 hover:bg-muted group-data-[state=open]:hover:bg-inherit">
              <div className="grow">
                <AccordionTrigger className="w-full py-4 pr-1 hover:no-underline item-center">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-[state=open]:text-primary">
                      <LayersIcon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold leading-none">{zone.code}</span>
                        <Badge variant="secondary">{zone.type.replace(/_/g, " ")}</Badge>
                        <Badge variant={zone.active ? "success" : "secondary"}>
                          {zone.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="truncate text-sm font-normal text-muted-foreground">{zone.name}</p>
                    </div>
                  </div>
                </AccordionTrigger>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={`More options for ${zone.code}`}>
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    {hasLink(zone._links, "edit-zone") && (
                      <DropdownMenuItem asChild>
                        <Link to={zone.id}>Edit</Link>
                      </DropdownMenuItem>
                    )}
                    {activateLink && (
                      <DropdownMenuItem onClick={() => handleActivate(activateLink, {
                        success: "Successfully activated",
                        error: `Failed to activate ${zone.name}`
                      })}>
                        Activate
                      </DropdownMenuItem>
                    )}
                    {deactivateLink && (
                      <DropdownMenuItem onClick={() => handleDeactivate(deactivateLink, {
                        success: "Successfully deactivated",
                        error: `Failed to deactivate ${zone.name}`
                      })}>
                        Deactivate
                      </DropdownMenuItem>
                    )}
                    {deleteLink && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(deleteLink, {
                          success: "Successfully deleted",
                          error: `Failed to delete ${zone.name}`
                        })} className="text-destructive">
                          Delete
                        </DropdownMenuItem></>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <AccordionContent className="!h-auto px-6 pb-6 [&_a]:no-underline">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BoxesIcon className="size-4 text-muted-foreground" />
                    Bins in this zone
                  </div>
                  {createBinLink && (
                    <Button type="button" variant="outline" asChild>
                      <Link to={`${zone.id}/bins/new`}>
                        Add Bin
                      </Link>
                    </Button>
                  )}
                </div>
                {pagedBinLink ? (
                  <BinTable locationId={locationId} zoneId={zone.id} link={pagedBinLink} onLifecycleEvent={onLifecycleEvent as any} />
                ) : (
                  <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                    Bins are not available for this zone.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
