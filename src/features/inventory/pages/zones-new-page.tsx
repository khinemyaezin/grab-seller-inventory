import { Button } from "@khinemyaezin/seller-ui/components/index";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import ZoneNewForm from "@/features/inventory/components/zone/zone-new-form";
import { ZoneLifecycleEvent } from "@/types";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";
import { useLocationZoneLinks } from "@/features/inventory/hooks/use-location-zone-links";

export default function NewZonePage() {
    const { locationId } = useParams<{ locationId: string }>();
    if (!locationId)
        throw new Error("Missing locationId route parameter");
    const { locationName, createZone } = useLocationZoneLinks(locationId);
    const platform = usePlatform();

    useShellBreadcrumbSegment(":locationId", locationName);
    const toast = (type: "success" | "error", message: string) =>
        platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

    const handleEvent = (event: ZoneLifecycleEvent) => {
        switch (event.type) {
            case "created":
                toast("success", "Zone created successfully");
                break;
            case "createFailed":
                toast("error", "Failed to create zone");
                break;
        }
    };

    return (
        <div className="container mx-auto max-w-3xl p-6">
            <Header
                title={`New Zone`}
                description="Create zone."
            >
                <ButtonGroup>
                    <Button variant="secondary" size="icon" type="button" asChild>
                        <Link to=".." relative="path" className="flex gap-2 items-center">
                            <ArrowLeftIcon />
                        </Link>
                    </Button>
                </ButtonGroup>
            </Header>
            {createZone && (
                <ZoneNewForm link={createZone} locationId={locationId} onLifecycleEvent={handleEvent} />
            )}
        </div>
    )
}
