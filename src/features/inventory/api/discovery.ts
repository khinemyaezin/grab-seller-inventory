import { api, resolveLink, type HateoasLink } from "@khinemyaezin/seller-api";
import type { InventoryRoot } from "../types";
import { InventoryRootResponse } from "../types/inventory.response";

export async function fetchInventoryRoot(link: HateoasLink): Promise<InventoryRoot> {
  const response = await api.followLink<InventoryRootResponse>(link)

  return {
    self: resolveLink(response._links, "self"),
    searchLocation: resolveLink(response._links, "search-locations"),
    location: resolveLink(response._links, "location"),
    createLocation: resolveLink(response._links, "create-location"),
  };
}
