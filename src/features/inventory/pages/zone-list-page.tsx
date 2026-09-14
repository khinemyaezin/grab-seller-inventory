import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { useLocationZoneLinks } from "@/features/inventory/hooks/use-location-zone-links";
import LocationZonesView from "@/features/inventory/components/location/location-zones-view";
import { ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";

export default function ZonesPage() {
  const { locationId: id } = useParams<{ locationId: string }>();
  const { location, searchZones, createZone } = useLocationZoneLinks(id);
  const platform = usePlatform();

  useShellBreadcrumbSegment(":locationId", location?.name);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: ZoneLifecycleEvent | BinLifecycleEvent) => {
    switch (event.type) {
      case "activated": toast("success", "Successfully activated"); break;
      case "activateFailed": toast("error", "Failed to activate"); break;
      case "deactivated": toast("success", "Successfully deactivated"); break;
      case "deactivateFailed": toast("error", "Failed to deactivate"); break;
      case "deleted": toast("success", "Successfully deleted"); break;
      case "deleteFailed": toast("error", "Failed to delete"); break;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      <Header
        title="Zones"
        description="Manage zones and bins for this location."
      >
        <Button variant="secondary" asChild>
          <Link to="../.." relative="path" className="flex gap-2 items-center">
            <ArrowLeftIcon />
          </Link>
        </Button>
      </Header>

      {id && (
        <LocationZonesView
          locationId={id}
          location={location}
          searchLink={searchZones}
          canCreate={!!createZone}
          onLifecycleEvent={handleEvent}
        />
      )}
    </div>
  );
}
