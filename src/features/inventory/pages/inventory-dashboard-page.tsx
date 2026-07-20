import { Header } from "@khinemyaezin/seller-ui/layout/header";
import InventoryDashboardView from "@/features/inventory/components/dashboard/inventory-dashboard-view";

export default function InventoryDashboardPage() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Dashboard"
        description="Stock health, status mix, and quantity totals for your inventory."
      />
      <InventoryDashboardView />
    </div>
  );
}
