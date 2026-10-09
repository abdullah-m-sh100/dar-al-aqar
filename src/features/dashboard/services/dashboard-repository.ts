import "server-only";

import {
  demoOwner,
  inquiries,
  ownerListings,
  type Inquiry,
  type OwnerListing,
} from "@/data/dashboard";
import { getPropertiesByIds } from "@/features/properties/services/property-repository";
import type { Property } from "@/features/properties/types";

export type OwnerListingRow = OwnerListing & { property: Property };
export type InquiryRow = Inquiry & { property: Property | undefined };

/** Demo workspace loader. Replace with a session-scoped API call. */
export async function getOwnerWorkspace() {
  const properties = await getPropertiesByIds(ownerListings.map((listing) => listing.propertyId));
  const byId = new Map(properties.map((property) => [property.id, property]));

  const listings: OwnerListingRow[] = ownerListings.flatMap((listing) => {
    const property = byId.get(listing.propertyId);
    return property ? [{ ...listing, property }] : [];
  });

  const inquiryRows: InquiryRow[] = inquiries.map((inquiry) => ({
    ...inquiry,
    property: byId.get(inquiry.propertyId),
  }));

  return {
    owner: demoOwner,
    listings,
    inquiries: inquiryRows,
    stats: {
      active: listings.filter((listing) => listing.status === "active").length,
      views: listings.reduce((sum, listing) => sum + listing.views, 0),
      newInquiries: inquiryRows.filter((inquiry) => inquiry.status === "new").length,
      saves: listings.reduce((sum, listing) => sum + listing.saves, 0),
    },
  };
}
