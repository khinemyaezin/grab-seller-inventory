import { useState } from "react";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useInventorySummary } from "@/features/inventory/hooks/use-items";
import { Package, AlertTriangle } from "lucide-react";
import InventorySummaryKpis from "./inventory-summary-kpis";
import StockHealthPieChart from "./stock-health-pie-chart";
import InventoryStatusPieChart from "./inventory-status-pie-chart";
import ReorderSuggestionsView from "../item/reorder-suggestions-view";
import InventoryDashboardFilter from "./inventory-dashboard-filter";

export default function InventoryDashboardView() {
  const summaryLink = useInventoryLink("inventorySummary");
  const [locationId, setLocationId] = useState<string | undefined>();

  const { data, isLoading, isError } = useInventorySummary(summaryLink, locationId);

  if (!summaryLink) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-center text-muted-foreground">
            Inventory summary is not available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <InventoryDashboardFilter
          locationId={locationId}
          onLocationChange={setLocationId}
        />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-8 w-28 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">
              Failed to load inventory summary. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          <InventorySummaryKpis summary={data} />
          <div className="grid gap-6 lg:grid-cols-2">
            <StockHealthPieChart health={data.health} />
            <InventoryStatusPieChart status={data.status} totalItems={data.totalItems} />
          </div>
        </>
      )}

      <ReorderSuggestionsView locationId={locationId}/>
    </div>
  );
}
