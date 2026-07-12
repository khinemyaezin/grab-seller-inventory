
import BinEditForm from "@/features/inventory/components/bin/bin-edit-form";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { useRoot } from "@/features/inventory/hooks/use-root";
import { useLocation } from "@/features/inventory/hooks/use-locations";
import { useZone } from "@/features/inventory/hooks/use-zones";
import { resolveLink } from "@khinemyaezin/seller-api";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import type { HateoasLink } from "@khinemyaezin/seller-api";

export type EditBinPageProps = {
  params: Promise<{ id: string; zoneId: string; binId: string }>;
};

export default function EditBinPage() {
  const { locationId, zoneId, binId } = useParams<{ locationId: string; zoneId: string; binId: string }>();
  if (!locationId || !zoneId || !binId) throw new Error("Missing inventory route parameters");
  const id = locationId;
  const { data: inventory } = useRoot();
  const { data: location } = useLocation(inventory?.location, id);
  const zoneLink = resolveLink(location?._links, "zone") ?? ({} as HateoasLink);
  const { data: zone } = useZone(zoneLink, zoneId);
  const binLink = resolveLink(zone?._links, "bin");

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
        <BinEditForm link={binLink} id={binId} />
      )}
    </div>
  );
}
