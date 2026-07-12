
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { routes } from "@khinemyaezin/seller-contracts";
import { useRoot } from "@/features/inventory/hooks/use-root";
import LocationEditForm from "@/features/inventory/components/location/location-edit-form";

type EditLocationPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditLocationPage() {
  const { locationId: id } = useParams<{ locationId: string }>();
  const { data: inventoryRoot } = useRoot();

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header
        title={`Edit Location`}
        description="Update location details and manage zones."
      >
        <ButtonGroup>
          <ButtonGroup>
            <Button asChild variant="secondary" size="icon" type="button">
              <Link to=".." className="flex gap-2 items-center">
                <ArrowLeftIcon />
              </Link>
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </Header>
      {inventoryRoot?.location && id && (
        <LocationEditForm locationId={id} link={inventoryRoot.location} />
      )}
    </div>
  );
}
