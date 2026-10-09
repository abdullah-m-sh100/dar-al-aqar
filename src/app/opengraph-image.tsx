import { ImageResponse } from "next/og";

export const alt = "DAR AL AQAR — property discovery in Saudi Arabia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Brand social card (Latin text only, since the OG renderer has no Arabic shaping). */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #102d35 0%, #1b555c 100%)",
        color: "white",
      }}
    >
      <svg width="96" height="96" viewBox="0 0 40 40">
        <rect width="40" height="40" rx="12" fill="rgba(255,255,255,0.1)" />
        <path
          d="M11.5 30.5V18.75a8.5 8.5 0 0 1 17 0V30.5"
          fill="none"
          stroke="#bae7d4"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M16.75 30.5v-8.25a3.25 3.25 0 0 1 6.5 0v8.25z" fill="#d2a77e" />
        <path d="M8.5 30.5h23" stroke="#bae7d4" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: 6 }}>DAR AL AQAR</div>
        <div style={{ fontSize: 40, color: "#bae7d4", marginTop: 12 }}>
          Your Next Place Starts Here
        </div>
      </div>
      <div style={{ fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
        Riyadh · Jeddah · Dammam · Khobar · Makkah · Madinah
      </div>
    </div>,
    size,
  );
}
