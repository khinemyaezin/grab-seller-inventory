import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform } from "@khinemyaezin/seller-ui";
import ItemNewForm from "@/features/inventory/components/item/item-new-form";
import type { ItemLifecycleEvent } from "@/types";

export default function ItemNewPage() {
  const navigate = useNavigate();
  const platform = usePlatform();
  const toast = (type: "success" | "error", message: string) =>
    platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: ItemLifecycleEvent) => {
    switch (event.type) {
      case "created":
        toast("success", "Stock item created successfully");
        navigate("..");
        break;
      case "createFailed":
        toast("error", event.message);
        break;
      case "navigation":
        navigate(`../${event.itemId}`)
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Add stock item"
        description="Provision inventory for a SKU at a location."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary" asChild>
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </Header>
      <ItemNewForm onLifecycleEvent={handleEvent} />
    </div>
  );
}
