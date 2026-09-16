import ZoneEditForm from "./zone-edit-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { useLocationZoneLinks } from "@/features/inventory/use-location-zone-links";
import { ZoneLifecycleEvent } from "@/types";

export default function EditZonePage() {
    const { locationId, zoneId } = useParams<{ locationId: string; zoneId: string }>();
    if (!locationId || !zoneId) throw new Error("Missing inventory route parameters");
    const { locationName, zoneGetLink } = useLocationZoneLinks(locationId);
    const platform = usePlatform();
    const [title, setTitle] = useState<string | undefined>();

    useShellBreadcrumbSegment(":locationId", locationName);
    useShellBreadcrumbSegment(":zoneId", title);

    const toast = (type: "success" | "error", message: string) =>
        platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

    const handleEvent = (event: ZoneLifecycleEvent) => {
        switch (event.type) {
            case "titleResolved": setTitle(event.title); break;
            case "updated": toast("success", "Zone updated successfully"); break;
            case "updateFailed": toast("error", "Failed to update zone"); break;
            case "activated": toast("success", "Zone activated successfully"); break;
            case "activateFailed": toast("error", "Failed to activate zone"); break;
            case "deactivated": toast("success", "Zone deactivated successfully"); break;
            case "deactivateFailed": toast("error", "Failed to deactivate zone"); break;
        }
    };

    return (
        <div className="container mx-auto max-w-3xl p-6">
            <Header
                title={`Edit Zone`}
                description="Update zone."
            >
                <ButtonGroup>
                    <Button variant="secondary" size="icon" type="button">
                        <Link to=".." relative="path" className="flex gap-2 items-center">
                            <ArrowLeftIcon />
                        </Link>
                    </Button>
                </ButtonGroup>
            </Header>
            {zoneGetLink && (
                <ZoneEditForm
                    link={zoneGetLink} id={zoneId} onLifecycleEvent={handleEvent}
                />
            )}
        </div>
    )
}
