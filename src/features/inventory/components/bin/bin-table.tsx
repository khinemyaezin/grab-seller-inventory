
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { BoxIcon, GaugeIcon, MoreHorizontalIcon, PackageIcon } from "lucide-react";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { Link } from "react-router";
import type { HateoasLink, BinLifecycleEvent } from "@/types";
import type { BinResponse } from "@/features/inventory/types/inventory.model";
import { useBins, useActivateBinMutation, useDeactivateBinMutation, useDeleteBinMutation } from "@/features/inventory/hooks/use-bins";

import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuSeparator,
} from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { Card, CardAction, CardContent, CardHeader } from "@khinemyaezin/seller-ui/components/card";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import type { BinFilterFormValue } from "@/features/inventory/hooks/use-bin-filter";

type BinTableProps = {
  locationId: string;
  zoneId: string;
  link: HateoasLink;
  filter: BinFilterFormValue;
  onPageChange?: (page: number) => void;
  onLifecycleEvent?: (event: BinLifecycleEvent) => void;
};

export function BinTable({ zoneId, link, filter, onPageChange, onLifecycleEvent }: BinTableProps) {
  const { data: bins, isLoading } = useBins(link, zoneId, filter);
  const activateMutation = useActivateBinMutation();
  const deactivateMutation = useDeactivateBinMutation();
  const deleteMutation = useDeleteBinMutation();
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

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1].map((placeholder) => (
          <div
            className="min-h-32 rounded-lg border bg-background p-4 shadow-xs"
            key={placeholder}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-md bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
            </div>
            <div className="mt-6 h-2 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (!bins?._embedded || bins._embedded.binResponseList.length === 0) {
    return (
      <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed bg-background px-4 py-6 text-center">
        <div className="space-y-1">
          <BoxIcon className="mx-auto size-5 text-muted-foreground" />
          <p className="text-sm font-medium">No bins yet</p>
          <p className="text-xs text-muted-foreground">Create bins to track shelf capacity in this zone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid w-full gap-3 sm:grid-cols-2">
        {bins._embedded.binResponseList.map((bin: BinResponse) => {
          const activateLink = resolveLink(bin._links, "activate-bin");
          const deactivateLink = resolveLink(bin._links, "deactivate-bin");
          const deleteLink = resolveLink(bin._links, "delete-bin");

          return (
            <Card key={bin.id} className="bg-muted dark:bg-background">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <PackageIcon className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold leading-none">{bin.code}</span>
                      <Badge variant={bin.active ? "success" : "secondary"}>
                        {bin.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{bin.name}</p>
                  </div>
                </div>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" aria-label={`More options for ${bin.code}`}>
                        <MoreHorizontalIcon />
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
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(deleteLink, {
                                success: "Successfully deleted",
                                error: `Failed to delete ${bin.name}`
                              })} className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <GaugeIcon className="size-3.5" />
                    Max capacity
                  </div>
                  <span className="text-lg font-semibold leading-none">{bin.maxCapacity}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {bins.page.totalPages > 1 && (
        <Pager
          className="justify-end"
          onPageChange={onPageChange}
          {...bins.page}
        />
      )}
    </div>
  );
}
