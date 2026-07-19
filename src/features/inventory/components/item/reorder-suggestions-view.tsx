import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Link } from "react-router";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useReorderSuggestions } from "@/features/inventory/hooks/use-items";
import type { ReorderSuggestionResponse, ReorderSuggestionsResponse } from "@/features/inventory/types";

function extractSuggestions(data?: ReorderSuggestionsResponse): ReorderSuggestionResponse[] {
  const embedded = data?._embedded;
  if (!embedded) {
    return [];
  }
  if (embedded.reorderSuggestionResponseList) {
    return embedded.reorderSuggestionResponseList;
  }
  return Object.values(embedded).flatMap((value) => (Array.isArray(value) ? value : []));
}

export default function ReorderSuggestionsView() {
  const link = useInventoryLink("reorderSuggestions");
  const { data, isLoading } = useReorderSuggestions(link);
  const suggestions = extractSuggestions(data);

  if (!link) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Reorder suggestions are not available.
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">Loading suggestions…</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Reorder point</TableHead>
              <TableHead>Suggested qty</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.length > 0 ? (
              suggestions.map((row) => (
                <TableRow key={row.inventoryItemId}>
                  <TableCell>
                    <Link to={`../${row.inventoryItemId}`} className="font-medium hover:underline">
                      {row.sku}
                    </Link>
                  </TableCell>
                  <TableCell className="tabular-nums">{row.currentAvailable}</TableCell>
                  <TableCell className="tabular-nums">{row.reorderPoint}</TableCell>
                  <TableCell className="tabular-nums">{row.suggestedQuantity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.priority}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No reorder suggestions right now.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
