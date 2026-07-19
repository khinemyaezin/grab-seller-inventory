import { Route, Routes } from "react-router";
import { NotFoundPage } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";
import ItemListPage from "@/features/inventory/pages/item-list-page";
import ItemNewPage from "@/features/inventory/pages/item-new-page";
import ItemDetailPage from "@/features/inventory/pages/item-detail-page";
import CoveragePage from "@/features/inventory/pages/coverage-page";
import ReorderSuggestionsPage from "@/features/inventory/pages/reorder-suggestions-page";
import { CatalogEntryLinkProvider } from "@/features/inventory/context/catalog-entry-link";
import InventoryProviders from "./InventoryProviders";
import "../styles-stock.css";

export default function StockRoutes({
  link,
  catalogLink,
  platform,
}: {
  link: HateoasLink;
  catalogLink?: HateoasLink | null;
  platform?: SellerPlatform;
}) {
  return (
    <InventoryProviders link={link} platform={platform}>
      <CatalogEntryLinkProvider link={catalogLink ?? undefined}>
        <Routes>
          <Route index element={<ItemListPage />} />
          <Route path="new" element={<ItemNewPage />} />
          <Route path="coverage" element={<CoveragePage />} />
          <Route path="reorder" element={<ReorderSuggestionsPage />} />
          <Route path=":itemId" element={<ItemDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CatalogEntryLinkProvider>
    </InventoryProviders>
  );
}
