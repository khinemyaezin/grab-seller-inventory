import { Card, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
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
import { ImageIcon } from "lucide-react";

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

export default function ReorderSuggestionsView({ locationId }: { locationId?: string }) {
  const link = useInventoryLink("reorderSuggestions");
  const { data, isLoading } = useReorderSuggestions(link, { ...(locationId && { locationId: locationId }) });
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
      <CardHeader>
        <CardTitle>
          Recorder Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                    <div className="flex gap-3 py-1">
                      <div className="flex w-12 shrink-0 items-center justify-center rounded-md bg-secondary">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="font-medium leading-tight">
                          <Link to={`stocks/${row.inventoryItemId}`} relative="path" className="hover:underline">
                            {row.productName}
                          </Link>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>{row.sku}</div>
                        </div>
                      </div>
                    </div>
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
