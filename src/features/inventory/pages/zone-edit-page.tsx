
import ZoneEditForm from "@/features/inventory/components/zone/zone-edit-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { resolveLink } from "@khinemyaezin/seller-api";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { ZoneLifecycleEvent } from "@/types";

export type EditZonePageProps = {
    params: Promise<{ id: string, zoneId: string }>;
}

export default function EditZonePage() {
    const { locationId, zoneId } = useParams<{ locationId: string; zoneId: string }>();
    if (!locationId || !zoneId) throw new Error("Missing inventory route parameters");
    const id = locationId;
    const locationLink = useInventoryLink("location");
    const { data: location } = useLocation(locationLink, id);
    const zoneLink = resolveLink(location?._links, "zone");
    const platform = usePlatform();
    const [title, setTitle] = useState<string | undefined>();

    useShellBreadcrumbSegment(":locationId", location?.name);
    useShellBreadcrumbSegment(":zoneId", title);

    const toast = (type: "success" | "error", message: string) =>
        platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

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
            {zoneLink && (
                <ZoneEditForm
                    link={zoneLink} id={zoneId} onLifecycleEvent={handleEvent}
                />
            )}
        </div>
    )
}
