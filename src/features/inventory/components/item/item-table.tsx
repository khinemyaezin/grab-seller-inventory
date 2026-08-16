import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Link } from "react-router";
import { hasLink } from "@khinemyaezin/seller-api";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import { ImageIcon } from "lucide-react";
import { useItems } from "@/features/inventory/hooks/use-items";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import type { InventoryItemResponse } from "@/features/inventory/types";
import type { ItemFilterFormValue } from "@/features/inventory/hooks/use-item-filter";

export type ItemTableProps = {
  filter: ItemFilterFormValue;
  onPageChange?: (page: number) => void;
};

export default function ItemTable({ filter, onPageChange }: ItemTableProps) {
  const searchLink = useInventoryLink("searchInventoryItems");
  const { data } = useItems(searchLink, filter);
  const items = data?._embedded?.inventoryResponseList ?? [];
  const showPagination = (data?.page.totalPages ?? 0) > 1;

  if(items.length == 0) 
    return <NoItems/>

  return (
    <Table className="[&_tr>*:first-child]:pl-(--card-spacing) [&_tr>*:last-child]:pr-(--card-spacing)">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>Item</TableHead>
          <TableHead>On Hand</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>In Transit</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead>Reorder Point</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item) => <ItemTableRow key={item.id} item={item} />)
        ) : (
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
                  Showing {data?.page ? data.page.number * data.page.size + 1 : 0} -{" "}
                  {data?.page ? data.page.number * data.page.size + items.length : 0} of{" "}
                  {data?.page.totalElements} items
                </span>
                {data?.page && (
                  <Pager className="justify-end" onPageChange={onPageChange} {...data.page} />
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

function ItemTableRow({ item }: { item: InventoryItemResponse }) {

  return (
    <TableRow>
      <TableCell>
        <div className="flex gap-3 py-1">
          <div className="flex w-12 shrink-0 items-center justify-center rounded-md bg-secondary">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="font-medium leading-tight">
              {hasLink(item._links, "self") ? (
                <Link to={item.id} className="hover:underline">
                  {item.productName}
                </Link>
              ) : (
                <span>{item.productName}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>{item.sku}</div>
              {item.locationName && <div>{item.locationName}</div>}
            </div>
          </div>
        </div>
      </TableCell>
      <UnitsCell value={item.onHand} />
      <UnitsCell value={item.available} />
      <UnitsCell value={item.inTransit ?? 0} />
      <UnitsCell value={item.reserved} />
      <UnitsCell value={item.reorderPoint} />
    </TableRow>
  );
}

function UnitsCell({ value, className }: { value: number; className?: string }) {
  return (
    <TableCell>
      {value}
    </TableCell>
  );
}

function NoItems() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <p className="text-base font-semibold text-foreground">No inventory found</p>
      <p className="text-sm text-muted-foreground">
        Try changing the filters or search term
      </p>
    </div>
  );
}
