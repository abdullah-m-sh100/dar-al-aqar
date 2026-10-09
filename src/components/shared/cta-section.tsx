import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Photo } from "@/lib/media";

type CTASectionProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  photo: Photo;
  credit: string;
};

/** Full-width call-to-action panel over architectural photography. */
export function CTASection({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  photo,
  credit,
}: CTASectionProps) {
  return (
    <section className="container-site py-20 lg:py-28">
      <div className="relative isolate overflow-hidden rounded-panel px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
        <Image
          src={photo.src}
          alt=""
          fill
          sizes="(min-width: 1312px) 1250px, 100vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(16_45_53/0.95)_0%,rgb(27_85_92/0.82)_55%,rgb(27_85_92/0.35)_100%)] rtl:bg-[linear-gradient(260deg,rgb(16_45_53/0.95)_0%,rgb(27_85_92/0.82)_55%,rgb(27_85_92/0.35)_100%)]"
        />
        <div className="max-w-2xl">
          {eyebrow && <p className="mb-4 text-sm font-semibold text-mint">{eyebrow}</p>}
          <h2 className="text-title font-bold text-white">{title}</h2>
          <p className="mt-4 text-lg text-white/75">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="mint" size="lg">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight aria-hidden className="flip-rtl" />
              </Link>
            </Button>
            {secondary && (
              <Button asChild variant="outline-light" size="lg">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
        <p className="absolute end-4 bottom-3 text-[0.68rem] text-white/50">{credit}</p>
      </div>
    </section>
  );
}
