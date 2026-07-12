
import ZoneEditForm from "@/features/inventory/components/zone/zone-edit-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { routes } from "@khinemyaezin/seller-contracts";
import { useRoot } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { resolveLink } from "@khinemyaezin/seller-api";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";


export type EditZonePageProps = {
    params: Promise<{ id: string, zoneId: string }>;
}

export default function EditZonePage() {
    const { locationId, zoneId } = useParams<{ locationId: string; zoneId: string }>();
    if (!locationId || !zoneId) throw new Error("Missing inventory route parameters");
    const id = locationId;
    const { data: inventory } = useRoot();
    const { data: location } = useLocation(inventory?.location, id);
    const zoneLink = resolveLink(location?._links, "zone");

    return (
        <div className="container mx-auto max-w-5xl p-6">
            <Header
                title={`Edit Zone`}
                description="Update zone."
            >
                <ButtonGroup>
                    <Button variant="secondary" size="icon" type="button">
                        <Link to=".." className="flex gap-2 items-center">
                            <ArrowLeftIcon />
                        </Link>
                    </Button>
                </ButtonGroup>
            </Header>
            {zoneLink && (
                <ZoneEditForm
                    link={zoneLink} id={zoneId}
                />
            )}
        </div>
    )
}
