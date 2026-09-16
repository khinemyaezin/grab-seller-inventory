import { Button, PageLoadingSkeleton } from "@khinemyaezin/seller-ui/components/index";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { BinLifecycleEvent } from "@/types";
import BinNewForm from "./bin-new-form";
import { useLocationZoneLinks } from "@/features/inventory/use-location-zone-links";

export default function NewBinPage() {
  const { locationId, zoneId } = useParams<{ locationId: string; zoneId: string }>();
  if (!locationId || !zoneId) throw new Error("Missing inventory route parameters");
  const { locationName, zoneName, createBin } = useLocationZoneLinks(locationId, zoneId);
  const platform = usePlatform();

  useShellBreadcrumbSegment(":locationId", locationName);
  useShellBreadcrumbSegment(":zoneId", zoneName);

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: BinLifecycleEvent) => {
    switch (event.type) {
      case "created": toast("success", "Bin created successfully"); break;
      case "createFailed": toast("error", "Failed to create bin"); break;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
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
      {createBin ? (
        <BinNewForm link={createBin} zoneId={zoneId} onLifecycleEvent={handleEvent} />
      ) : (
        <PageLoadingSkeleton rows={2} />
      )}
    </div>
  );
}
