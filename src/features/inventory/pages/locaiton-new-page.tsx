
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform } from "@khinemyaezin/seller-ui";
import LocationNewForm from "@/features/inventory/components/location/location-new-form";
import { LocationLifecycleEvent } from "@/types";

export default function NewLocationPage() {
  const navigate = useNavigate();
  const platform = usePlatform();
  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: LocationLifecycleEvent) => {
    switch (event.type) {
      case "created":
        toast("success", "Location created successfully");
        navigate("..");
        break;
      case "createFailed":
        toast("error", "Failed to create location");
        break;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Add Location"
        description="Create a new warehouse, store, or distribution center."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary" asChild>
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>

        </ButtonGroup>
      </Header>
      <LocationNewForm onLifecycleEvent={handleEvent} />
    </div>
  );
}
