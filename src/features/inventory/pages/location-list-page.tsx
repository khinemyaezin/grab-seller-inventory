
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform } from "@khinemyaezin/seller-ui";
import LocationsView from "@/features/inventory/components/location/locations-view";
import { LocationLifecycleEvent } from "@/types";

export default function LocationsPage() {
  const platform = usePlatform();

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: LocationLifecycleEvent) => {
    switch (event.type) {
      case "activated": toast("success", "Location activated successfully"); break;
      case "activateFailed": toast("error", "Failed to activate location"); break;
      case "deactivated": toast("success", "Location deactivated successfully"); break;
      case "deactivateFailed": toast("error", "Failed to deactivate location"); break;
      case "deleted": toast("success", "Location deleted successfully"); break;
      case "deleteFailed": toast("error", "Failed to delete location"); break;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Location"
        description="Manage your warehouses, stores, and distribution centers.">
      </Header>

      <LocationsView onLifecycleEvent={handleEvent} />
    </div>
  );
}
