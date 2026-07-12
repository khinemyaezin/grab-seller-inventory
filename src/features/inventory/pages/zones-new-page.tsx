
import { Button } from "@khinemyaezin/seller-ui/components/index";

import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { routes } from "@khinemyaezin/seller-contracts";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import ZoneNewForm from "@/features/inventory/components/zone/zone-new-form";
import { resolveLink } from "@khinemyaezin/seller-api";
import { ZoneLifecycleEvent } from "@/types";
import { usePlatform, useShellBreadcrumbSegment } from "@khinemyaezin/seller-ui";

type NewZonePageProps = {
    params: Promise<{ id: string }>;
};

export default function NewZonePage() {
    const { locationId } = useParams<{ locationId: string }>();
    if (!locationId) throw new Error("Missing locationId route parameter");
    const id = locationId;
    const locationLink = useInventoryLink("location");
    const { data: location } = useLocation(locationLink, id);
    const navigate = useNavigate();

    const createZoneLink = resolveLink(location?._links, "create-zone");

    const platform = usePlatform();
    useShellBreadcrumbSegment(":locationId", location?.name);
    const toast = (type: "success" | "error", message: string) =>
        platform?.events.publish("shell:toast:v1", { type, message, position: "top-center" });

    const handleEvent = (event: ZoneLifecycleEvent) => {
        switch (event.type) {
            case "created":
                toast("success", "Zone created successfully");
                navigate("..");
                break;
            case "createFailed":
                toast("error", "Failed to create zone");
                break;
        }
    };

    return (
        <div className="container mx-auto max-w-5xl p-6">
            <Header
                title={`New Zone`}
                description="Create zone."
            >
                <ButtonGroup>
                    <ButtonGroup>
                        <Button variant="secondary" size="icon" type="button">
                            <Link to=".." className="flex gap-2 items-center">
                                <ArrowLeftIcon />
                            </Link>
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>
            </Header>
            {createZoneLink && (
                <ZoneNewForm link={createZoneLink} locationId={id} onLifecycleEvent={handleEvent} />
            )}
        </div>
    )
}
