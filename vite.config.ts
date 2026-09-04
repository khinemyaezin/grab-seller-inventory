import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: mode === "development" ? "http://localhost:3002/" : "/mfe/seller-inventory/",
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "grab_seller_inventory",
        filename: "remoteEntry.js",
        manifest: true,
        dts: { generateTypes: { tsConfigPath: "./tsconfig.app.json", abortOnError: true } },
        exposes: {
          "./DashboardRoutes": "./src/app/DashboardRoutes.tsx",
          "./LocationRoutes": "./src/app/LocationRoutes.tsx",
          "./StockRoutes": "./src/app/StockRoutes.tsx",
          "./ProductInventoryWidget": "./src/features/inventory/components/item/product-inventory-widget-exposed.tsx",
          "./InlineInventoryWidget": "./src/features/inventory/components/item/inline-inventory-widget-exposed.tsx",
          "./InventoryItemEditWidget": "./src/features/inventory/components/item/inventory-item-edit-exposed.tsx",
        },
        shared: {
          "react": { singleton: true, requiredVersion: "19.2.4" },
          "react-dom": { singleton: true, requiredVersion: "19.2.4" },
          "react-router": { singleton: true, requiredVersion: "7.18.0" },
          "react-hook-form": { singleton: true, requiredVersion: "7.74.0" },
          "recharts": { singleton: true },
          "@tanstack/react-query": { singleton: true, requiredVersion: "5.99.2" },
          "@khinemyaezin/seller-api": { singleton: true, version: "^1.0.1-canary-d98e36f" },
          "@khinemyaezin/seller-ui": { singleton: true, version: "^1.0.1-canary-d98e36f" },
          "@khinemyaezin/seller-contracts": { singleton: true, version: "^1.0.1-canary-d98e36f"},
        },
      }),
    ],
    server: {
      port: 3002,
      origin: env.VITE_ORIGIN,
      cors: { origin: env.VITE_CORS_ORIGIN },
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          xfwd: true,
          timeout: 0,
          proxyTimeout: 0,
        },
      },
    },
    preview: { port: 3002 },
    build: { target: "chrome111", cssCodeSplit: false },
  }
});
