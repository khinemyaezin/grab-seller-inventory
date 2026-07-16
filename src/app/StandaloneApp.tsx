import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ThemeProvider, Toaster } from "@khinemyaezin/seller-ui";
import { configureApi } from "@khinemyaezin/seller-api";
import LocationRoutes from "./LocationRoutes";
import StockRoutes from "./StockRoutes";

configureApi({
  baseUrl: "/api/v1",
  getToken: async () => {
    const token = localStorage.getItem("access_token");
    return token || undefined;
  }
});

const inventoryUrl =
  import.meta.env.VITE_INVENTORY_API_URL ?? import.meta.env.VITE_CATALOG_API_URL;
const catalogUrl = import.meta.env.VITE_CATALOG_API_URL;

export default function StandaloneApp() {
  const [client] = useState(() => new QueryClient());
  return (
    <ThemeProvider><QueryClientProvider client={client}>
      <BrowserRouter>
        <main className="min-h-screen bg-background p-8">
          <Toaster />
          <Routes>
            <Route
              path="inventory/locations/*"
              element={<LocationRoutes link={{ href: inventoryUrl }} />}
            />
            <Route
              path="inventory/stocks/*"
              element={<StockRoutes link={{ href: inventoryUrl }} catalogLink={{ href: catalogUrl }} />}
            />
            <Route path="*" element={<Navigate to="inventory/locations" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
    </ThemeProvider>
  );
}
