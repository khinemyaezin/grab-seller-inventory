import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import { Pager } from "@khinemyaezin/seller-ui/components/pager";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { useItemMovements } from "@/features/inventory/hooks/use-items";
import { useState } from "react";

export type ItemMovementsTableProps = {
  link: HateoasLink;
};

export default function ItemMovementsTable({ link }: ItemMovementsTableProps) {
  const [page, setPage] = useState(0);
  const { data } = useItemMovements(link, { page, size: 10 });
  const movements = data?._embedded?.stockMovementResponseList ?? [];
  const showPagination = (data?.page.totalPages ?? 0) > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement history</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>On hand</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length > 0 ? (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell  className="grid grid-rows-2 gap-1">
                    <span>{formatLabel(movement.type)}</span>
                    <span className="text-muted-foreground"> {formatDate(movement.createdAt)}</span>
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>
                    {movement.onHandBefore} → {movement.onHandAfter}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {movement.referenceId ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center">
                  No movements yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {showPagination && data?.page && (
            <TableFooter className="bg-transparent">
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-end py-3">
                    <Pager className="justify-end" onPageChange={setPage} {...data.page} />
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
