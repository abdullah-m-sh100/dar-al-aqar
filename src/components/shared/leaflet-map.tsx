"use client";

import "leaflet/dist/leaflet.css";

import { useRouter } from "next/navigation";
import { MapPinOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  /** Short pill text (e.g. a price). */
  label: string;
  title: string;
  subtitle?: string;
  href?: string;
};

type LeafletMapProps = {
  points: MapPoint[];
  /** Accessible name for the map region. */
  label: string;
  zoom?: number;
  className?: string;
};

// Esri Light Gray Canvas: keyless raster tiles with a calm palette that suits the brand.
// For production traffic, move to a provider/plan with an agreed usage policy.
const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/**
 * Lightweight Leaflet map. Leaflet is imported lazily inside the effect so it
 * never runs on the server and stays out of the initial bundle.
 */
export function LeafletMap({ points, label, zoom = 13, className }: LeafletMapProps) {
  const { t } = useI18n();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Leaflet owns this DOM node: syncing an external widget is what effects are for.
  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;

    import("leaflet")
      .then((L) => {
        const container = containerRef.current;
        if (cancelled || !container) return;

        const map = L.map(container, { scrollWheelZoom: false, zoomControl: true });
        destroy = () => map.remove();
        L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 16 }).addTo(map);

        const markers = points.map((point) => {
          const pill = document.createElement("span");
          pill.textContent = point.label;
          const icon = L.divIcon({ className: "map-pin", html: pill, iconSize: [0, 0] });
          const marker = L.marker([point.lat, point.lng], {
            icon,
            title: point.title,
            keyboard: true,
          });

          const popup = document.createElement("div");
          popup.className = "min-w-44 font-sans";
          const heading = document.createElement(point.href ? "a" : "p");
          heading.textContent = point.title;
          heading.className = "block text-sm font-semibold text-ink";
          if (point.href && heading instanceof HTMLAnchorElement) {
            const href = point.href;
            heading.href = href;
            heading.addEventListener("click", (event) => {
              event.preventDefault();
              router.push(href);
            });
          }
          popup.append(heading);
          if (point.subtitle) {
            const sub = document.createElement("p");
            sub.textContent = point.subtitle;
            sub.className = "mt-1 text-xs text-fg-muted";
            popup.append(sub);
          }
          marker.bindPopup(popup);
          return marker.addTo(map);
        });

        if (points.length === 1) {
          map.setView([points[0].lat, points[0].lng], zoom);
        } else if (points.length > 1) {
          map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [48, 48], maxZoom: zoom });
        } else {
          map.setView([23.9, 45.1], 5); // Saudi Arabia
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [points, zoom, router]);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card border border-line bg-mint-soft",
        className,
      )}
    >
      <div
        ref={containerRef}
        dir="ltr"
        role="region"
        aria-label={label}
        className="absolute inset-0 z-0"
      />
      {status !== "ready" && (
        <div className="absolute inset-0 z-10 grid place-items-center text-sm text-fg-muted">
          {status === "loading" ? (
            <span className="absolute inset-0 skeleton" aria-label={t.common.mapLoading} />
          ) : (
            <span className="flex items-center gap-2">
              <MapPinOff aria-hidden className="size-4" />
              {t.common.mapUnavailable}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
