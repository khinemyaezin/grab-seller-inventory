import { Field } from "@khinemyaezin/seller-ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@khinemyaezin/seller-ui/components/select";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";

const ALL_LOCATIONS = "__all__";

type InventoryDashboardFilterProps = {
  locationId?: string;
  onLocationChange: (locationId?: string) => void;
};

export default function InventoryDashboardFilter({
  locationId,
  onLocationChange,
}: InventoryDashboardFilterProps) {
  const searchLocationsLink = useInventoryLink("searchLocation");
  const { data: locationsData } = useLocations(searchLocationsLink, { page: 0, size: 100 });
  const locations = locationsData?._embedded?.locationResponseList ?? [];

  return (
    <Field className="w-full sm:w-72">
      <Select
        value={locationId ?? ALL_LOCATIONS}
        onValueChange={(value) => {
          const next = value === ALL_LOCATIONS ? undefined : (value ?? undefined);
          onLocationChange(next);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_LOCATIONS}>All locations</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.code} — {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
