import { Header } from "@khinemyaezin/seller-ui/layout/header";
import ReorderSuggestionsView from "@/features/inventory/components/item/reorder-suggestions-view";

export default function ReorderSuggestionsPage() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Reorder suggestions"
        description="Items at or below reorder thresholds, ranked by priority."
      />
      <ReorderSuggestionsView />
    </div>
  );
}
