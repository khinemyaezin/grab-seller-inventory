
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
import { useEffect, useState } from "react";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import { useLocations, useActivateLocationMutation, useDeactivateLocationMutation, useDeleteLocationMutation } from "@/features/inventory/hooks/use-locations";
import { useEntityActions } from "@/features/inventory/hooks/use-entity-actions";
import { Pageable } from "@khinemyaezin/seller-api";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";

import { LocationLifecycleEvent } from "@/types";

export type LocationTableProps = {
  filter: {} & Pageable,
  onPageChange?: (page: number) => void;
  onLifecycleEvent?: (event: LocationLifecycleEvent) => void;
};

export default function LocationTable({ filter, onPageChange, onLifecycleEvent }: LocationTableProps) {
  const pagedLocationLink = useInventoryLink("pagedLocation");
  const { data, isLoading } = useLocations(pagedLocationLink, filter);
  const [showPagination, setShowPagination] = useState<boolean>(false);
  const activateMutation = useActivateLocationMutation();
  const deactivateMutation = useDeactivateLocationMutation();
  const deleteMutation = useDeleteLocationMutation();
  const { handleActivate, handleDeactivate, handleDelete } = useEntityActions({
    activate: activateMutation,
    deactivate: deactivateMutation,
    delete: deleteMutation,
    entityName: "Location",
    onLifecycleEvent,
  });

  useEffect(() => {
    if (data) {
      setShowPagination(data.page.totalPages > 1)
    }
  },
    [data, filter]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Links</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?._embedded ? data?._embedded.locationResponseList.map((location) => {
          const activateLink = resolveLink(location._links, "activate-location");
          const deactivateLink = resolveLink(location._links, "deactivate-location");
          const deleteLink = resolveLink(location._links, "delete-location");

          return (
            <TableRow key={location.id}>
              <TableCell className="font-medium">
                {hasLink(location._links, "self") ? (
                  <Link
                    to={`${location.id}/zones`}
                    className="text-blue-600 hover:underline"
                  >
                    {location.code}
                  </Link>
                ) : (
                  <span>{location.code}</span>
                )}
              </TableCell>
              <TableCell>{location.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{location.type}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {[location.address.city, location.address.country].filter(Boolean).join(", ")}
              </TableCell>
              <TableCell>
                <Badge variant={location.active ? "default" : "outline"}>
                  {location.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-xs">
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
                        <DropdownMenuItem onClick={() => handleDelete(deleteLink, {
                          success: "Successfully deleted",
                          error: `Failed to delete ${location.name}`
                        })} className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        }) : (
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground pointer-events-none text-center">
              No record found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {showPagination && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-muted-foreground">
              Showing {data?._embedded.locationResponseList.length} of {data?.page.totalElements} products
            </TableCell>
            <TableCell colSpan={3}>
              {data?.page && (
                <Pager
                  className="justify-end"
                  onPageChange={onPageChange}
                  {...data?.page}
                />
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
