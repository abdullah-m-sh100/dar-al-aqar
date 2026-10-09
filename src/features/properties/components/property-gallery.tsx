"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Dialog } from "radix-ui";
import { useState, type KeyboardEvent } from "react";

import type { Locale } from "@/i18n/config";
import { formatNumber, interpolate } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import type { Property } from "../types";
import { imageAlt, photoCredit } from "../utils/labels";

type PropertyGalleryProps = { property: Property };

/** Mosaic gallery with an accessible, keyboard-driven fullscreen lightbox. */
export function PropertyGallery({ property }: PropertyGalleryProps) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const images = property.images;
  const total = images.length;
  const g = t.property.gallery;
  const isRtl = locale === "ar";

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  function step(delta: number) {
    setDirection(delta);
    setIndex((current) => (current + delta + total) % total);
  }

  function onKeyDown(event: KeyboardEvent) {
    // Arrow keys follow reading direction: "forward" is left in RTL.
    if (event.key === "ArrowRight") step(isRtl ? -1 : 1);
    if (event.key === "ArrowLeft") step(isRtl ? 1 : -1);
  }

  const n = (value: number) => formatNumber(value, locale);
  const tile = "group relative overflow-hidden bg-line focus-visible:outline-offset-[-4px]";

  return (
    <>
      <div className="relative grid h-[20rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-panel sm:h-[26rem] lg:h-[34rem]">
        {images.slice(0, 3).map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => openAt(i)}
            aria-label={interpolate(g.open, { index: n(i + 1) })}
            className={cn(
              tile,
              "cursor-zoom-in",
              i === 0 ? "col-span-4 row-span-2 md:col-span-3" : "hidden md:block",
              i === 1 && total === 2 && "row-span-2",
            )}
          >
            <Image
              src={image.src}
              alt={imageAlt(property, i, locale, t)}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 768px) 75vw, 100vw" : "25vw"}
              className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04]"
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute end-4 bottom-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-lift backdrop-blur transition-colors hover:bg-white"
        >
          <Images aria-hidden className="size-4" />
          {interpolate(g.viewAll, { count: n(total) })}
        </button>
      </div>
      <p className="mt-2 text-xs text-fg-muted">{g.representativeNote}</p>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/95 data-[state=open]:animate-[fade-in_200ms_ease-out]" />
          <Dialog.Content
            onKeyDown={onKeyDown}
            className="fixed inset-0 z-50 flex flex-col text-white focus:outline-none data-[state=open]:animate-[fade-in_250ms_ease-out]"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Dialog.Title className="truncate text-sm font-semibold">
                {g.dialogTitle} · {property.title[locale]}
              </Dialog.Title>
              <Dialog.Description className="sr-only">{g.representativeNote}</Dialog.Description>
              <div className="flex items-center gap-3">
                <span aria-live="polite" className="text-sm text-white/70 tabular-nums">
                  {interpolate(g.counter, { index: n(index + 1), total: n(total) })}
                </span>
                <Dialog.Close
                  aria-label={t.common.close}
                  className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-white/10"
                >
                  <X aria-hidden className="size-5" />
                </Dialog.Close>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.figure
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * (isRtl ? -60 : 60) }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * (isRtl ? 60 : -60) }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 px-4 pb-8 sm:px-20"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={images[index].src}
                      alt={imageAlt(property, index, locale, t)}
                      fill
                      sizes="100vw"
                      quality={85}
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-1 text-center text-xs text-white/60">
                    {t.imageKinds[images[index].kind]} · {photoCredit(images[index].credit, t)}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
              <GalleryArrow side="start" label={g.prev} onClick={() => step(-1)} locale={locale} />
              <GalleryArrow side="end" label={g.next} onClick={() => step(1)} locale={locale} />
            </div>

            <div className="scrollbar-none flex justify-center gap-2 overflow-x-auto px-4 py-4">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={interpolate(g.thumbnail, { index: n(i + 1) })}
                  aria-current={i === index}
                  className={cn(
                    "relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all",
                    i === index ? "ring-2 ring-mint" : "opacity-50 hover:opacity-90",
                  )}
                >
                  <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function GalleryArrow({
  side,
  label,
  onClick,
  locale,
}: {
  side: "start" | "end";
  label: string;
  onClick: () => void;
  locale: Locale;
}) {
  // Logical sides: "end" (next) is on the left in RTL.
  const Icon = (side === "end") !== (locale === "ar") ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20",
        side === "start" ? "start-3 sm:start-6" : "end-3 sm:end-6",
      )}
    >
      <Icon aria-hidden className="size-6" />
    </button>
  );
}
