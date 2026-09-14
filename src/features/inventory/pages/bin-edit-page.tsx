import BinEditForm from "@/features/inventory/components/bin/bin-edit-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button, PageLoadingSkeleton } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { usePlatform, useShellBreadcrumb, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { BinLifecycleEvent } from "@/types";
import { useLocationZoneLinks } from "@/features/inventory/hooks/use-location-zone-links";

export default function EditBinPage() {
  const { locationId, zoneId, binId } = useParams<{ locationId: string; zoneId: string; binId: string }>();
  if (!locationId || !zoneId || !binId) throw new Error("Missing inventory route parameters");
  const { locationName, zoneName, binGetLink } = useLocationZoneLinks(locationId, zoneId);
  const platform = usePlatform();
  const [title, setTitle] = useState<string | undefined>();

  useShellBreadcrumbSegment(":locationId", locationName);
  useShellBreadcrumbSegment(":zoneId", zoneName);
  useShellBreadcrumb(title);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

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
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Edit Bin"
        description="Update bin details."
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
      {binGetLink ? (
        <BinEditForm link={binGetLink} id={binId} onLifecycleEvent={handleEvent} />
      ) : (
        <PageLoadingSkeleton rows={2} />
      )}
    </div>
  );
}
