
import { Button, PageLoadingSkeleton } from "@khinemyaezin/seller-ui/components/index";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { useZone } from "@/features/inventory/hooks/use-zones";
import { resolveLink } from "@khinemyaezin/seller-api";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { BinLifecycleEvent } from "@/types";
import BinNewForm from "@/features/inventory/components/bin/bin-new-form";

type NewBinPageProps = {
  params: Promise<{ id: string; zoneId: string }>;
};

export default function NewBinPage() {
  const { locationId, zoneId } = useParams<{ locationId: string; zoneId: string }>();
  if (!locationId || !zoneId) throw new Error("Missing inventory route parameters");
  const id = locationId;
  const locationLink = useInventoryLink("location");
  const { data: location } = useLocation(locationLink, id);
  const zoneLink = resolveLink(location?._links, "zone") ?? ({} as HateoasLink);
  const { data: zone } = useZone(zoneLink, zoneId);

  const createBinLink = resolveLink(zone?._links, "create-bin");
  const platform = usePlatform();

  useShellBreadcrumbSegment(":locationId", location?.name);
  useShellBreadcrumbSegment(":zoneId", zone?.name);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: BinLifecycleEvent) => {
    switch (event.type) {
      case "created": toast("success", "Bin created successfully"); break;
      case "createFailed": toast("error", "Failed to create bin"); break;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Header
        title="New Bin"
        description="Create a new bin in this zone."
      >
        <ButtonGroup>
          <Button variant="secondary" size="icon" type="button" asChild>
            <Link to={{
              pathname: "../../..",
              search: `?active=${zoneId}`,
            }}
              relative="path" className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </Header>
      {createBinLink ? (
        <BinNewForm link={createBinLink} zoneId={zoneId} onLifecycleEvent={handleEvent} />
      ) : (
        <PageLoadingSkeleton rows={2} />
      )}
    </div>
  );
}
