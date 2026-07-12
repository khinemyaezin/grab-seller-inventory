
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform, useShellBreadcrumb } from "@khinemyaezin/seller-ui";
import LocationEditForm from "@/features/inventory/components/location/location-edit-form";
import { LocationLifecycleEvent } from "@/types";


export default function EditLocationPage() {
  const { locationId: id } = useParams<{ locationId: string }>();
  const platform = usePlatform();
  const [title, setTitle] = useState<string | undefined>();

  useShellBreadcrumb(title);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });
  
  const handleEvent = (event: LocationLifecycleEvent) => {
    switch (event.type) {
      case "titleResolved": setTitle(event.title); break;
      case "updated": toast("success", "Location updated successfully"); break;
      case "updateFailed": toast("error", "Failed to update location"); break;
      case "activated": toast("success", "Location activated successfully"); break;
      case "activateFailed": toast("error", "Failed to activate location"); break;
      case "deactivated": toast("success", "Location deactivated successfully"); break;
      case "deactivateFailed": toast("error", "Failed to deactivate location"); break;
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header
        title={`Edit Location`}
        description="Update location details and manage zones."
      >
        <ButtonGroup>
          <ButtonGroup>
            <Button asChild variant="secondary" size="icon" type="button">
              <Link to=".." className="flex gap-2 items-center">
                <ArrowLeftIcon />
              </Link>
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </Header>
      {id && (
        <LocationEditForm locationId={id} onLifecycleEvent={handleEvent} />
      )}
    </div>
  );
}
