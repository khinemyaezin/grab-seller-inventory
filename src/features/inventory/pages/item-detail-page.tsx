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
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <Header
        title="Stock item"
        description="View quantities, receive or adjust stock, and review movements."
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
