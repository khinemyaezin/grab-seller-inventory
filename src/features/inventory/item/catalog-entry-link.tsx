import { createContext, useContext, type ReactNode } from "react";
import type { HateoasLink } from "@khinemyaezin/seller-api";

const CatalogEntryLinkContext = createContext<HateoasLink | undefined>(
  undefined,
);

export function CatalogEntryLinkProvider({
  link,
  children,
}: {
  link?: HateoasLink;
  children: ReactNode;
}) {
  return (
    <CatalogEntryLinkContext.Provider value={link}>
      {children}
    </CatalogEntryLinkContext.Provider>
  );
}

export function useCatalogEntryLink() {
  return useContext(CatalogEntryLinkContext);
}
