export const LISTING_TYPES = ["sale", "rent"] as const;

export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "land",
  "floor",
  "townhouse",
  "commercial",
  "office",
] as const;

export const FURNISHING_STATUSES = ["furnished", "semi-furnished", "unfurnished"] as const;

export const FACADES = ["north", "south", "east", "west", "corner"] as const;

export const AMENITIES = [
  "parking",
  "elevator",
  "central-ac",
  "split-ac",
  "balcony",
  "garden",
  "security",
  "smart-home",
  "pool",
  "majlis",
  "maid-room",
  "driver-room",
  "gym",
  "sea-view",
  "equipped-kitchen",
  "storage",
  "private-entrance",
  "rooftop",
] as const;

export const IMAGE_KINDS = [
  "exterior",
  "aerial",
  "living",
  "majlis",
  "kitchen",
  "dining",
  "bedroom",
  "bathroom",
  "pool",
  "terrace",
  "view",
  "interior",
  "land",
] as const;

/** Property types that carry bedroom/bathroom counts. */
export const RESIDENTIAL_TYPES = ["apartment", "villa", "floor", "townhouse"] as const;
