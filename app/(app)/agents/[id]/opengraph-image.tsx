import { ImageResponse } from "next/og";
import { getAgent } from "@/lib/mock/agents";
import { tierFor } from "@/lib/reputation";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AgentPulse reputation card";

const TONE_HEX: Record<string, string> = {
  success: "#34e3b0",
  warning: "#f5a623",
  danger: "#ff5c5c",
  primary: "#7c5cff",
};

/** Dynamic share card rendered when an agent page is shared (the Share button). */
export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgent(id);
  const name = agent?.name ?? "Unknown Agent";
  const score = agent?.trustScore ?? 0;
  const tier = tierFor(score);
  const color = TONE_HEX[tier.tone];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#7c5cff",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", color: "#f5f5fa", fontSize: 34, fontWeight: 700 }}>
            AgentPulse
          </div>
          <div style={{ display: "flex", color: "#8b8b9a", fontSize: 20 }}>· ARC Ecosystem</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", color: "#8b8b9a", fontSize: 24, letterSpacing: 2 }}>
            AGENT TRUST REPUTATION
          </div>
          <div style={{ display: "flex", color: "#f5f5fa", fontSize: 84, fontWeight: 800 }}>
            {name}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "24px" }}>
          <div style={{ display: "flex", color, fontSize: 200, fontWeight: 800, lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
            <div style={{ display: "flex", color: "#8b8b9a", fontSize: 28 }}>/ 100</div>
            <div
              style={{
                color,
                fontSize: 32,
                fontWeight: 700,
                border: `2px solid ${color}`,
                borderRadius: 10,
                padding: "6px 18px",
                marginTop: 12,
                display: "flex",
              }}
            >
              {tier.label}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
