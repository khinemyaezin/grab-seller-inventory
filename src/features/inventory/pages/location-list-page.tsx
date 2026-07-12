
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { useRoot } from "@/features/inventory/hooks/use-root";
import LocationsView from "@/features/inventory/components/location/locations-view";

export default function LocationsPage() {
  const { data: inventoryRoot } = useRoot();

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Header
        title="Location"
        description="Manage your warehouses, stores, and distribution centers.">
      </Header>

      {inventoryRoot?.pagedLocation && (
        <LocationsView
          link={inventoryRoot.pagedLocation}
          canCreate={!!inventoryRoot?.createLocation}
        />
      )}
    </div>
  );
}
