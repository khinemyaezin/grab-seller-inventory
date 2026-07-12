
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { MapPinIcon, BuildingIcon } from "lucide-react";
import type { LocationResponse } from "@/features/inventory/types";

type LocationSummaryProps = {
  location: LocationResponse;
};

export function LocationSummary({ location }: LocationSummaryProps) {
  const address = [
    location.address.line1,
    location.address.line2,
    location.address.city,
    location.address.state,
    location.address.postalCode,
    location.address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <BuildingIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{location.code}</span>
              <span className="text-muted-foreground">·</span>
              <span>{location.name}</span>
            </div>
            {address && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPinIcon className="size-3.5" />
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {location.type.replace(/_/g, " ")}
          </Badge>
          <Badge variant={location.active ? "default" : "outline"}>
            {location.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
