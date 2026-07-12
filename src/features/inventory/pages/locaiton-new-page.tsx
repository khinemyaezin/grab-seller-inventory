
import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { routes } from "@khinemyaezin/seller-contracts";
import LocationNewForm from "@/features/inventory/components/location/location-new-form";
import { useRoot } from "@/features/inventory/hooks/use-root";

export default function NewLocationPage() {
  const { data: inventoryRoot } = useRoot();
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header
        title="Add Location"
        description="Create a new warehouse, store, or distribution center."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary">
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
              <span>Back to Locations</span>
            </Link>
          </Button>

        </ButtonGroup>
      </Header>
      {inventoryRoot?.createLocation && (
        <LocationNewForm link={inventoryRoot.createLocation} />
      )}
    </div>
  );
}
