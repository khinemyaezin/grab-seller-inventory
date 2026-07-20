
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { routes } from "@khinemyaezin/seller-contracts";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { resolveLink } from "@khinemyaezin/seller-api";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { LocationSummary } from "@/features/inventory/components/location/location-summary";
import ZonesView from "@/features/inventory/components/zone/zones-view";
import { ZoneLifecycleEvent, BinLifecycleEvent } from "@/types";

type ZonesPageProps = {
  params: Promise<{ id: string }>;
};

export default function ZonesPage() {
  const { locationId: id } = useParams<{ locationId: string }>();
  const locationLink = useInventoryLink("location");
  const { data: location } = useLocation(locationLink, id);

  const pagedZone = resolveLink(location?._links, "search-zones");
  const createZone = resolveLink(location?._links, "create-zone");
  const platform = usePlatform();

  useShellBreadcrumbSegment(":locationId", location?.name);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

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

      {location && (
        <LocationSummary location={location} />
      )}

      {pagedZone && id && (
        <ZonesView locationId={id} link={pagedZone} canCreate={!!createZone} onLifecycleEvent={handleEvent} />
      )}
    </div>
  );
}
