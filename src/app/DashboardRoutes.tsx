import { Route, Routes } from "react-router";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import InventoryDashboardPage from "@/features/inventory/dashboard/inventory-dashboard-page";
import InventoryProviders from "./InventoryProviders";

export default function DashboardRoutes({
  link,
  platform,
}: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <InventoryProviders link={link} platform={platform}>
      <Routes>
        <Route index element={<InventoryDashboardPage />} />
      </Routes>
    </InventoryProviders>
  );
}
