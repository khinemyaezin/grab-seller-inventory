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
import { hasLink } from "@khinemyaezin/seller-api";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>On hand</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item, index) => <ItemTableRow key={item.id} number={`${(data?.page ? data.page.number * data.page.size : 0) + index + 1}`} item={item} />)
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

function ItemTableRow({ item, number }: { item: InventoryItemResponse, number: string }) {
  const isLowStock = item.available <= item.reorderPoint;

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{number}</TableCell>
      <TableCell className="grid grid-rows-2 gap-1">
        <span className="font-medium">
          {hasLink(item._links, "self") ? (
            <Link to={item.id} className="text-blue-600 hover:underline">
              {item.sku}
            </Link>
          ) : (
            <span>{item.sku}</span>
          )}
        </span>
        {item.productName && (
          <span className="font-normal text-muted-foreground">{item.productName}</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{item.locationName}</TableCell>
      <TableCell>{item.onHand}</TableCell>
      <TableCell>
        <span className={isLowStock ? "text-destructive font-medium" : undefined}>
          {item.available}
        </span>
      </TableCell>
      <TableCell>{item.reserved}</TableCell>
      <TableCell>
        <Badge variant={item.status === "ACTIVE" ? "success" : "secondary"}>
          {item.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
