
import BinEditForm from "@/features/inventory/components/bin/bin-edit-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { useZone } from "@/features/inventory/hooks/use-zones";
import { resolveLink } from "@khinemyaezin/seller-api";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { BinLifecycleEvent } from "@/types";

export type EditBinPageProps = {
  params: Promise<{ id: string; zoneId: string; binId: string }>;
};

export default function EditBinPage() {
  const { locationId, zoneId, binId } = useParams<{ locationId: string; zoneId: string; binId: string }>();
  if (!locationId || !zoneId || !binId) throw new Error("Missing inventory route parameters");
  const id = locationId;
  const locationLink = useInventoryLink("location");
  const { data: location } = useLocation(locationLink, id);
  const zoneLink = resolveLink(location?._links, "zone") ?? ({} as HateoasLink);
  const { data: zone } = useZone(zoneLink, zoneId);
  const binLink = resolveLink(zone?._links, "bin");
  const platform = usePlatform();
  const [title, setTitle] = useState<string | undefined>();

  useShellBreadcrumbSegment(":locationId", location?.name);
  useShellBreadcrumbSegment(":zoneId", zone?.name);
  useShellBreadcrumbSegment(":binId", title);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: BinLifecycleEvent) => {
    switch (event.type) {
      case "titleResolved": setTitle(event.title); break;
      case "updated": toast("success", "Bin updated successfully"); break;
      case "updateFailed": toast("error", "Failed to update bin"); break;
      case "activated": toast("success", "Bin activated successfully"); break;
      case "activateFailed": toast("error", "Failed to activate bin"); break;
      case "deactivated": toast("success", "Bin deactivated successfully"); break;
      case "deactivateFailed": toast("error", "Failed to deactivate bin"); break;
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header
        title="Edit Bin"
        description="Update bin details."
      >
        <ButtonGroup>
          <Button variant="secondary" size="icon" type="button">
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </Header>
      {binLink && (
        <BinEditForm link={binLink} id={binId} onLifecycleEvent={handleEvent} />
      )}
    </div>
  );
}
