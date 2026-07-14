
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Link } from "react-router";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import { useLocations, useActivateLocationMutation, useDeactivateLocationMutation, useDeleteLocationMutation } from "@/features/inventory/hooks/use-locations";

import { useInventoryLink } from "@/features/inventory/hooks/use-root";

import { LocationLifecycleEvent, LocationResponse, HateoasLink } from "@/types";
import type { LocationFilterFormValue } from "@/features/inventory/hooks/use-location-filter";

export type LocationTableProps = {
  filter: LocationFilterFormValue,
  onPageChange?: (page: number) => void;
  onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
};

export default function LocationTable({ filter, onPageChange, onLifecycleEvent }: LocationTableProps) {
  const pagedLocationLink = useInventoryLink("pagedLocation");
  const { data } = useLocations(pagedLocationLink, filter);
  const locations = data?._embedded?.locationResponseList ?? [];
  const showPagination = (data?.page.totalPages ?? 0) > 1;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.length > 0 ? locations.map((location) => (
          <LocationTableRow
            key={location.id}
            location={location}
            onLifecycleEvent={onLifecycleEvent}
          />
        )) : (
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground pointer-events-none text-center">
              No record found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {showPagination && (
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell colSpan={6}>
              <div className="flex w-full items-center justify-between py-3">
                <span className="text-muted-foreground grow">
                  Showing {data?.page ? data.page.number * data.page.size + 1 : 0} - {data?.page ? data.page.number * data.page.size + locations.length : 0} of {data?.page.totalElements} locations
                </span>
                {data?.page && (
                  <Pager
                    className="justify-end"
                    onPageChange={onPageChange}
                    {...data?.page}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

type LocationTableRowProps = {
  location: LocationResponse,
  onLifecycleEvent?: (event: LocationLifecycleEvent) => void;

};

function LocationTableRow({ location, onLifecycleEvent }: LocationTableRowProps) {
  const activateLink = resolveLink(location._links, "activate-location");
  const deactivateLink = resolveLink(location._links, "deactivate-location");
  const deleteLink = resolveLink(location._links, "delete-location");
  const activateMutation = useActivateLocationMutation();
  const deactivateMutation = useDeactivateLocationMutation();
  const deleteMutation = useDeleteLocationMutation();

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

  return (
    <TableRow>
      <TableCell className="grid grid-rows-2 gap-1">
        <span className="font-medium">
          {hasLink(location._links, "self") ? (
            <Link
              to={`${location.id}/zones`}
              className="text-blue-600 hover:underline"
            >
              {location.code}
            </Link>) : (
            <span>{location.code}</span>
          )}
        </span>
        <span className="font-normal text-muted-foreground">{location.name}</span>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{location.type}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {[location.address.city, location.address.country].filter(Boolean).join(", ")}
      </TableCell>
      <TableCell>
        <Badge variant={location.active ? "success" : "secondary"}>
          {location.active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {hasLink(location._links, "edit-location") && (
                <DropdownMenuItem asChild>
                  <Link to={location.id}>Edit</Link>
                </DropdownMenuItem>
              )}
              {activateLink && (
                <DropdownMenuItem onClick={() => handleActivate(activateLink, {
                  success: "Successfully activated",
                  error: `Failed to activate ${location.name}`
                })}>
                  Activate
                </DropdownMenuItem>
              )}
              {deactivateLink && (
                <DropdownMenuItem onClick={() => handleDeactivate(deactivateLink, {
                  success: "Successfully deactivated",
                  error: `Failed to deactivate ${location.name}`
                })}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {deleteLink && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete(deleteLink, {
                    success: "Successfully deleted",
                    error: `Failed to delete ${location.name}`
                  })} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
