import { Navigate, Route, Routes } from "react-router";
import { NotFoundPage } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import LocationsPage from "@/features/inventory/pages/location-list-page";
import NewLocationPage from "@/features/inventory/pages/locaiton-new-page";
import EditLocationPage from "@/features/inventory/pages/location-edit-page";
import ZonesPage from "@/features/inventory/pages/zone-list-page";
import NewZonePage from "@/features/inventory/pages/zones-new-page";
import EditZonePage from "@/features/inventory/pages/zone-edit-page";
import NewBinPage from "@/features/inventory/pages/bins-new-page";
import EditBinPage from "@/features/inventory/pages/bin-edit-page";
import InventoryProviders from "./InventoryProviders";

export default function LocationRoutes({
  link,
  platform,
}: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <InventoryProviders link={link} platform={platform}>
      <Routes>
        <Route index element={<LocationsPage />} />
        <Route path="new" element={<NewLocationPage />} />
        <Route path=":locationId" element={<EditLocationPage />} />
        <Route path=":locationId/zones" element={<ZonesPage />} />
        <Route path=":locationId/zones/new" element={<NewZonePage />} />
        <Route path=":locationId/zones/:zoneId" element={<EditZonePage />} />
        <Route path=":locationId/zones/:zoneId/bins/new" element={<NewBinPage />} />
        <Route path=":locationId/zones/:zoneId/bins" element={<Navigate to="../.." relative="path" />} />
        <Route path=":locationId/zones/:zoneId/bins/:binId" element={<EditBinPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </InventoryProviders>
  );
}
