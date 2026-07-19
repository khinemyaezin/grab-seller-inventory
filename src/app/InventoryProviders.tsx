import type { ReactNode } from "react";
import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { SellerPlatform } from "@khinemyaezin/seller-contracts";

export default function InventoryProviders({
  link,
  platform,
  children,
}: {
  link: HateoasLink;
  platform?: SellerPlatform;
  children: ReactNode;
}) {
  return (
    <div className="seller-inventory-mfe">
      <PlatformProvider platform={platform}>
        <EntryLinkProvider link={link}>{children}</EntryLinkProvider>
      </PlatformProvider>
    </div>
  );
}
