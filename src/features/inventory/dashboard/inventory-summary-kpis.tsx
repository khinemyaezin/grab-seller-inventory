import { Card, CardContent, CardHeader, CardTitle } from "@khinemyaezin/seller-ui/components/card";
import { Package, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { InventorySummaryResponse } from "@/features/inventory/types";

type InventorySummaryKpisProps = {
  summary: InventorySummaryResponse;
};

const tiles = [
  {
    label: "Total Items",
    icon: Package,
    getValue: (s: InventorySummaryResponse) => s.totalItems,
    color: "text-foreground",
    bg: "bg-muted",
  },
  {
    label: "Available",
    icon: CheckCircle2,
    getValue: (s: InventorySummaryResponse) => s.quantities.available,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Reserved",
    icon: Clock,
    getValue: (s: InventorySummaryResponse) => s.quantities.reserved,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    label: "Critical",
    icon: AlertTriangle,
    getValue: (s: InventorySummaryResponse) => s.health.critical.count,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

export default function InventorySummaryKpis({ summary }: InventorySummaryKpisProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <Card key={tile.label} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {tile.label}
              </CardTitle>
              <div className={`rounded-md p-1.5 ${tile.bg}`}>
                <Icon className={`h-4 w-4 ${tile.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums tracking-tight">
                {tile.getValue(summary).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
