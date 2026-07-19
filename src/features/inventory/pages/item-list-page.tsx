import { Header } from "@khinemyaezin/seller-ui/layout/header";
import ItemsView from "@/features/inventory/components/item/items-view";

export default function ItemListPage() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Stock"
        description="Manage inventory items, quantities, and stock movements."
      />
      <ItemsView />
    </div>
  );
}
