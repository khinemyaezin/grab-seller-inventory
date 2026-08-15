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
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { useItemReservations } from "@/features/inventory/hooks/use-items";
import { useState } from "react";

export type ItemReservationsTableProps = {
  link: HateoasLink;
};

export default function ItemReservationsTable({ link }: ItemReservationsTableProps) {
  const [page, setPage] = useState(0);
  const { data } = useItemReservations(link, { page, size: 10 });
  const reservations = data?._embedded?.inventoryReservationResponseList ?? [];
  const showPagination = (data?.page.totalPages ?? 0) > 1;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="grid grid-rows-2 gap-1">
                <span className="font-mono text-xs">{reservation.orderId}</span>
                <span className="text-muted-foreground text-xs">{reservation.orderLineId}</span>
              </TableCell>
              <TableCell>{reservation.quantity}</TableCell>
              <TableCell>
                <Badge >
                  {reservation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {reservation.expiresAt ? formatDate(reservation.expiresAt) : "—"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-muted-foreground text-center">
              No reservations yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {showPagination && data?.page && (
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex justify-end py-3">
                <Pager className="justify-end" onPageChange={setPage} {...data.page} />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}
