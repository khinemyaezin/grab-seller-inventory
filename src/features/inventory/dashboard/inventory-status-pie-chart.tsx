import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@khinemyaezin/seller-ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@khinemyaezin/seller-ui/components/chart";
import type { InventoryStatusBreakdown } from "@/features/inventory/types";

const chartConfig = {
  count: { label: "Items" },
  active: { label: "Active", color: "var(--chart-1)" },
  outOfStock: { label: "Out of stock", color: "var(--chart-2)" },
  suspended: { label: "Suspended", color: "var(--chart-3)" },
  discontinued: { label: "Discontinued", color: "var(--chart-4)" },
} satisfies ChartConfig;

type InventoryStatusPieChartProps = {
  status: InventoryStatusBreakdown;
  totalItems: number;
};

export default function InventoryStatusPieChart({
  status,
  totalItems,
}: InventoryStatusPieChartProps) {
  const chartData = [
    { bucket: "active", count: status.active.count, fill: "var(--color-active)" },
    { bucket: "outOfStock", count: status.outOfStock.count, fill: "var(--color-outOfStock)" },
    { bucket: "suspended", count: status.suspended.count, fill: "var(--color-suspended)" },
    { bucket: "discontinued", count: status.discontinued.count, fill: "var(--color-discontinued)" },
  ].filter((row) => row.count > 0);

  const activePct = totalItems > 0
    ? ((status.active.count / totalItems) * 100).toFixed(1)
    : "0";

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>
          Lifecycle status across {totalItems.toLocaleString()} items
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No inventory items in this scope.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] px-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
              <Pie
                data={chartData}
                dataKey="count"
                labelLine={false}
                label={({ payload, ...props }) => (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="var(--foreground)"
                  >
                    {payload.count}
                  </text>
                )}
                nameKey="bucket"
              />
              <ChartLegend content={<ChartLegendContent nameKey="bucket" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground">
          {activePct}% of items are active
        </div>
      </CardFooter>
    </Card>
  );
}
