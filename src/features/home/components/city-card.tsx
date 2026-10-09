import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { City } from "@/config/locations";
import { propertiesHref } from "@/features/search/search-params";
import type { Locale } from "@/i18n/config";
import { interpolate, plural } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type CityCardProps = {
  city: City;
  count: number;
  locale: Locale;
  t: Dictionary;
  size?: "default" | "large";
  className?: string;
};

export function CityCard({ city, count, locale, t, size = "default", className }: CityCardProps) {
  const name = city.name[locale];

  return (
    <Link
      href={propertiesHref({ city: city.slug })}
      aria-label={interpolate(t.home.cities.explore, { city: name })}
      className={cn(
        "group relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-card p-5 text-white shadow-soft",
        size === "large" && "min-h-72 p-7 lg:min-h-full",
        className,
      )}
    >
      <Image
        src={city.photo.src}
        alt=""
        fill
        sizes={
          size === "large" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"
        }
        className="-z-20 object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.07]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/5 transition-opacity group-hover:opacity-95"
      />
      <span
        aria-hidden
        className="absolute end-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-colors group-hover:bg-mint group-hover:text-ink"
      >
        <ArrowUpRight className="size-4 flip-rtl" />
      </span>
      <p className="text-xs text-white/70">{city.region[locale]}</p>
      <h3
        className={cn(
          "font-display font-bold text-white",
          size === "large" ? "text-3xl" : "text-xl",
        )}
      >
        {name}
      </h3>
      <p className="mt-1 text-sm text-mint">{plural(locale, count, t.common.properties)}</p>
    </Link>
  );
}
