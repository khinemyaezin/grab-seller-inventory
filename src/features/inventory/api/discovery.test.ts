import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { configureApi } from "@khinemyaezin/seller-api";
import { server } from "@/test/server";
import { fetchInventoryRoot } from "./discovery";

describe("inventory discovery", () => {
  it("maps inventory HAL relations into the Inventory contract", async () => {
    configureApi({ baseUrl: "http://api.test" });
    server.use(http.get("http://api.test/inventory", () => HttpResponse.json({
      _links: {
        self: { href: "/inventory" },
        "paged-location": { href: "/inventory/locations" },
        location: { href: "/inventory/locations/{locationId}", templated: true },
        "create-location": { href: "/inventory/locations" },
      },
    }, { headers: { "content-type": "application/hal+json" } })));

    const root = await fetchInventoryRoot({ href: "/inventory" });
    expect(root.pagedLocation?.href).toBe("/inventory/locations");
    expect(root.location?.templated).toBe(true);
  });
});
