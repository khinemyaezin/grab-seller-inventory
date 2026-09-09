import { createContext, useContext, useMemo, type ReactNode } from "react";
import type {
  InventoryCreateContext,
  InventoryPayload,
  SlotWidgetProps,
} from "@khinemyaezin/seller-contracts";
import { Skeleton } from "@khinemyaezin/seller-ui/components/skeleton";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useLocations } from "@/features/inventory/hooks/use-locations";
import type { LocationResponse } from "@/features/inventory/types";
import { ItemPopoverCreateForm } from "./item-popover-create-form";

export type InventoryLocationsContextValue = {
  locations: LocationResponse[];
  locationById: Map<string, LocationResponse>;
};

const InventoryLocationsContext = createContext<InventoryLocationsContextValue | null>(null);

export function useInventoryCreateLocations(): InventoryLocationsContextValue {
  const ctx = useContext(InventoryLocationsContext);
  if (!ctx) {
    throw new Error("useInventoryCreateLocations must be used within an InventoryCreateFormContext");
  }
  return ctx;
}

export type InventoryCreateFormContextProps = SlotWidgetProps<
  InventoryCreateContext,
  InventoryPayload
> & {
  loadingFallback?: ReactNode;
  children: ReactNode;
};

export function InventoryCreateFormContext({
  context,
  initialValue,
  onChange,
  registerHandle,
  loadingFallback,
  children,
}: InventoryCreateFormContextProps) {
  const searchLocationLink = useInventoryLink("searchLocation");
  const { data: locationsData, isLoading } = useLocations(searchLocationLink, {
    page: 0,
    size: 100,
  });

  const locations = useMemo(() => {
    return (locationsData?._embedded?.locationResponseList ?? []).filter(
      (location) => location.active,
    );
  }, [locationsData]);

  const locationById = useMemo(
    () => new Map(locations.map((location) => [location.id, location])),
    [locations],
  );

  const formSeed = useMemo((): InventoryPayload => {
    if (initialValue) {
      return initialValue;
    }
    return {
      sku: context?.sku ?? "",
      locations: locations.map((loc) => ({
        locationId: loc.id,
        initialQuantity: 0,
        safetyStock: 0,
      })),
    };
  }, [initialValue, context?.sku, locations]);

  const locationsContextValue = useMemo(
    () => ({
      locations,
      locationById,
    }),
    [locations, locationById],
  );

  if (isLoading && !initialValue && Boolean(searchLocationLink)) {
    return (
      loadingFallback ?? (
        <Skeleton className="h-24 w-full" />
      )
    );
  }

  return (
    <InventoryLocationsContext.Provider value={locationsContextValue}>
      <ItemPopoverCreateForm
        seed={formSeed}
        contextSku={context?.sku}
        onValuesChange={onChange}
        registerHandle={registerHandle}
      >
        {children}
      </ItemPopoverCreateForm>
    </InventoryLocationsContext.Provider>
  );
}
