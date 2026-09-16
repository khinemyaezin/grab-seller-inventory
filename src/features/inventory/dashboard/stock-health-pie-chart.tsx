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
import type { InventoryHealthBreakdown } from "@/features/inventory/types";

const chartConfig = {
  count: { label: "Items" },
  inStock: { label: "In stock", color: "var(--chart-1)" },
  lowStock: { label: "Low stock", color: "var(--chart-2)" },
  outOfStock: { label: "Out of stock", color: "var(--chart-3)" },
  critical: { label: "Critical", color: "var(--chart-4)" },
} satisfies ChartConfig;

type StockHealthPieChartProps = {
  health: InventoryHealthBreakdown;
};

export default function StockHealthPieChart({ health }: StockHealthPieChartProps) {
  const chartData = [
    { bucket: "inStock", count: health.inStock.count, fill: "var(--color-inStock)" },
    { bucket: "lowStock", count: health.lowStock.count, fill: "var(--color-lowStock)" },
    { bucket: "outOfStock", count: health.outOfStock.count, fill: "var(--color-outOfStock)" },
    { bucket: "critical", count: health.critical.count, fill: "var(--color-critical)" },
  ].filter((row) => row.count > 0);

  const inStockPct = health.eligibleItems > 0
    ? ((health.inStock.count / health.eligibleItems) * 100).toFixed(1)
    : "0";

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Stock Health</CardTitle>
        <CardDescription>
          Sellable items ({health.eligibleItems.toLocaleString()}) by available quantity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No sellable inventory items in this scope.
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
          {inStockPct}% of eligible items are in stock
        </div>
      </CardFooter>
    </Card>
  );
}
