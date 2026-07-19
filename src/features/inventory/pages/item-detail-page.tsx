import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform, useShellBreadcrumb } from "@khinemyaezin/seller-ui";
import ItemDetailView from "@/features/inventory/components/item/item-detail-view";
import type { ItemLifecycleEvent } from "@/types";

export default function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const platform = usePlatform();
  const [title, setTitle] = useState<string | undefined>();

  useShellBreadcrumb(title);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: ItemLifecycleEvent) => {
    switch (event.type) {
      case "titleResolved":
        setTitle(event.title);
        break;
      case "received":
        toast("success", "Stock received successfully");
        break;
      case "receiveFailed":
        toast("error", "Failed to receive stock");
        break;
      case "adjusted":
        toast("success", "Stock adjusted successfully");
        break;
      case "adjustFailed":
        toast("error", "Failed to adjust stock");
        break;
      case "damaged":
        toast("success", "Stock marked as damaged");
        break;
      case "damageFailed":
        toast("error", "Failed to mark stock as damaged");
        break;
      case "writtenOff":
        toast("success", "Stock written off");
        break;
      case "writeOffFailed":
        toast("error", "Failed to write off stock");
        break;
      case "returnedToVendor":
        toast("success", "Stock returned to vendor");
        break;
      case "returnToVendorFailed":
        toast("error", "Failed to return stock to vendor");
        break;
      case "transferred":
        toast("success", "Stock transferred successfully");
        break;
      case "transferFailed":
        toast("error", "Failed to transfer stock");
        break;
      case "inTransitAnnounced":
        toast("success", "Inbound stock announced");
        break;
      case "inTransitAnnounceFailed":
        toast("error", "Failed to announce inbound stock");
        break;
      case "inTransitReceived":
        toast("success", "Inbound stock received");
        break;
      case "inTransitReceiveFailed":
        toast("error", "Failed to receive inbound stock");
        break;
      case "reorderConfigUpdated":
        toast("success", "Reorder settings updated");
        break;
      case "reorderConfigUpdateFailed":
        toast("error", "Failed to update reorder settings");
        break;
      case "suspended":
        toast("success", "Inventory item suspended");
        break;
      case "suspendFailed":
        toast("error", "Failed to suspend inventory item");
        break;
      case "activated":
        toast("success", "Inventory item activated");
        break;
      case "activateFailed":
        toast("error", "Failed to activate inventory item");
        break;
      case "discontinued":
        toast("success", "Inventory item discontinued");
        break;
      case "discontinueFailed":
        toast("error", "Failed to discontinue inventory item");
        break;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <Header
        title="Stock item"
        description="View quantities, manage stock operations, and review movements."
      >
        <ButtonGroup>
          <Button asChild variant="secondary" size="icon" type="button">
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </Header>
      {itemId && (
        <ItemDetailView itemId={itemId} onLifecycleEvent={handleEvent} />
      )}
    </div>
  );
}
