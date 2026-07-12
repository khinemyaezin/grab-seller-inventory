
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { MoreHorizontalIcon } from "lucide-react";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { Link } from "react-router";
import type { HateoasLink } from "@/types";
import type { BinResponse } from "@/features/inventory/types/inventory.model";
import { useBins, useActivateBinMutation, useDeactivateBinMutation, useDeleteBinMutation } from "@/features/inventory/hooks/use-bins";
import { useEntityActions } from "@/features/inventory/hooks/use-entity-actions";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
} from "@khinemyaezin/seller-ui/components/dropdown-menu";

type BinTableProps = {
  locationId: string;
  zoneId: string;
  link: HateoasLink;
};

export function BinTable({ locationId, zoneId, link }: BinTableProps) {
  const { data: bins, isLoading } = useBins(link, zoneId);
  const activateMutation = useActivateBinMutation();
  const deactivateMutation = useDeactivateBinMutation();
  const deleteMutation = useDeleteBinMutation();
  const { handleActivate, handleDeactivate, handleDelete } = useEntityActions({
    activate: activateMutation,
    deactivate: deactivateMutation,
    delete: deleteMutation,
    entityName: "Bin",
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading bins...</p>;
  }

  if (!bins?._embedded || bins._embedded.binResponseList.length === 0) {
    return <p className="text-xs text-muted-foreground">No bins in this zone.</p>;
  }

  return (
    <div className="space-y-2 w-full">
      {bins._embedded.binResponseList.map((bin: BinResponse) => {
        const activateLink = resolveLink(bin._links, "activate-bin");
        const deactivateLink = resolveLink(bin._links, "deactivate-bin");
        const deleteLink = resolveLink(bin._links, "delete-bin");

        return (
          <div className="flex justify-between gap-2 border rounded-lg p-3" key={bin.id}>
            <div className="flex items-center justify-start gap-3">
              <span className="font-medium">{bin.code}</span>
              <span className="text-muted-foreground">{bin.name}</span>
              <span className="text-sm text-muted-foreground">Cap: {bin.maxCapacity}</span>
              <Badge variant={bin.active ? "default" : "outline"}>
                {bin.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <ButtonGroup className="flex-none">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" aria-label="More Options">
                    <MoreHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    {hasLink(bin._links, "edit-bin") && (
                      <DropdownMenuItem asChild>
                        <Link to={`${zoneId}/bins/${bin.id}`}>Edit</Link>
                      </DropdownMenuItem>
                    )}
                    {activateLink && (
                      <DropdownMenuItem
                        onClick={() => handleActivate(activateLink, {
                          success: "Successfully activated",
                          error: `Failed to activate ${bin.name}`
                        })}>
                        Activate
                      </DropdownMenuItem>
                    )}
                    {deactivateLink && (
                      <DropdownMenuItem
                        onClick={() => handleDeactivate(deactivateLink, {
                          success: "Successfully deactivated",
                          error: `Failed to deactivate ${bin.name}`
                        })}>
                        Deactivate
                      </DropdownMenuItem>
                    )}
                    {deleteLink && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(deleteLink, {
                          success: "Successfully deleted",
                          error: `Failed to delete ${bin.name}`
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
      })}
    </div>
  );
}
