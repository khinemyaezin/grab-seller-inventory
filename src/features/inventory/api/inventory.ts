import { api } from "@khinemyaezin/seller-api"
import { HateoasLink } from "@khinemyaezin/seller-api"
import { InventoryRootResponse } from "@/features/inventory/types/inventory.response"

export const inventoryService = {
    getRoot: (link: HateoasLink, headers?: Record<string, string>): Promise<InventoryRootResponse>  =>
        api.followLink<InventoryRootResponse>(link, "GET", undefined, undefined, headers)
}
