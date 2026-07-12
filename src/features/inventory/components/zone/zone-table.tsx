
import { useState } from "react";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { ChevronDownIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { Link } from "react-router";
import { ZoneResponse } from "@/features/inventory/types/inventory.response";
import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";
import { useZones, useActivateZoneMutation, useDeactivateZoneMutation, useRemoveZoneMutation } from "@/features/inventory/hooks/use-zones";
import { useEntityActions } from "@/features/inventory/hooks/use-entity-actions";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@khinemyaezin/seller-ui/components/collapsible";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenu } from "@khinemyaezin/seller-ui/components/dropdown-menu";
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
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const { data: zones } = useZones(link, locationId);
  const activateMutation = useActivateZoneMutation();
  const deactivateMutation = useDeactivateZoneMutation();
  const deleteMutation = useRemoveZoneMutation();

  const { handleActivate, handleDeactivate, handleDelete } = useEntityActions({
    activate: activateMutation,
    deactivate: deactivateMutation,
    delete: deleteMutation,
    entityName: "Zone",
    onLifecycleEvent,
  });

  return (
    <div className="space-y-3 w-full">
      {zones?._embedded ? zones?._embedded.zoneResponseList.map((zone: ZoneResponse) => {
        const pagedBinLink = resolveLink(zone._links, "paged-bin");
        const createBinLink = resolveLink(zone._links, "create-bin");
        const activateLink = resolveLink(zone._links, "activate-zone");
        const deactivateLink = resolveLink(zone._links, "deactivate-zone");
        const deleteLink = resolveLink(zone._links, "delete-zone");

        return (
          <div className="flex justify-between gap-2" key={zone.id}>
            <Collapsible
              open={expandedZoneId === zone.id}
              onOpenChange={(value) => {
                if (value) setExpandedZoneId(zone.id);
                else setExpandedZoneId("")
              }}
              className="flex-1 border rounded-lg data-open:bg-muted">
              <div className="d-full flex justify-between p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start gap-3">
                    <span>{zone.code}</span>
                    <span className="text-muted-foreground">{zone.name}</span>
                    <Badge variant="secondary">{zone.type}</Badge>
                    <Badge variant={zone.active ? "default" : "outline"}>
                      {zone.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <CollapsibleTrigger className="group" type="button">
                    <ChevronDownIcon className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180 cursor-pointer" />
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent className="border-t p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Bins</h4>
                    {createBinLink && (
                      <Button type="button" variant="outline" asChild>
                        <Link to={`${zone.id}/bins/new`} className="flex items-center gap-1">
                          Add Bin
                        </Link>
                      </Button>
                    )}
                  </div>
                  {pagedBinLink && (
                    <BinTable locationId={locationId} zoneId={zone.id} link={pagedBinLink} onLifecycleEvent={onLifecycleEvent as any} />
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <ButtonGroup className="flex-none h-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-3" aria-label="More Options">
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
                      <DropdownMenuItem onClick={() => handleDelete(deleteLink, {
                        success: "Successfully deleted",
                        error: `Failed to delete ${zone.name}`
                      })} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        );
      }) : (
        <div className="text-muted-foreground pointer-events-none">
          No record found.
        </div>
      )}
    </div>
  );
}