import type { LocationType, ZoneType } from "./inventory.model";

export type LocationFormValues = {
  code: string;
  name: string;
  type: LocationType;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export type LocationsFilterForm = {
  query?: string;
  active?: boolean;
  type?: LocationType;
};

export type ZoneFormValues = {
    code: string;
    name: string;
    type: ZoneType;
    active?: boolean;
}

export type ZonesFilterForm = {
    locationId?: string;
    query?: string;
    active?: boolean;
    type?: ZoneType;
};

export type BinFormValues = {
    code: string;
    name: string;
    maxCapacity: number;
    active?: boolean;
}

export type BinsFilterForm = {
    zoneId?: string;
    query?: string;
    active?: boolean;
};
