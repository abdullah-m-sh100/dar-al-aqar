import {
  Car,
  ChefHat,
  Cctv,
  Cpu,
  DoorOpen,
  Dumbbell,
  Fan,
  Flower2,
  Snowflake,
  Sofa,
  Sun,
  ArrowUpDown,
  Package,
  User,
  UserRound,
  Waves,
  WavesLadder,
  Fence,
  type LucideIcon,
} from "lucide-react";

import type { Dictionary } from "@/i18n/get-dictionary";

import type { Amenity } from "../types";

const AMENITY_ICONS: Record<Amenity, LucideIcon> = {
  parking: Car,
  elevator: ArrowUpDown,
  "central-ac": Snowflake,
  "split-ac": Fan,
  balcony: Fence,
  garden: Flower2,
  security: Cctv,
  "smart-home": Cpu,
  pool: WavesLadder,
  majlis: Sofa,
  "maid-room": UserRound,
  "driver-room": User,
  gym: Dumbbell,
  "sea-view": Waves,
  "equipped-kitchen": ChefHat,
  storage: Package,
  "private-entrance": DoorOpen,
  rooftop: Sun,
};

export function AmenitiesList({ amenities, t }: { amenities: Amenity[]; t: Dictionary }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {amenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];
        return (
          <li
            key={amenity}
            className="flex items-center gap-3 rounded-xl bg-canvas px-4 py-3 text-sm font-medium"
          >
            <Icon aria-hidden className="size-5 shrink-0 text-primary" />
            {t.amenities[amenity]}
          </li>
        );
      })}
    </ul>
  );
}
