import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "linear-gradient(135deg, #6366f1, #4338ca)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
              <path
                d="M10 20.5c0-3.5 2.7-6.3 6-6.3s6 2.8 6 6.3"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="16" cy="10.8" r="3.2" fill="white" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: "#111827" }}>
              Customer Success
            </div>
            <div style={{ fontSize: 30, fontWeight: 500, color: "#6b7280" }}>
              Platform
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#4338ca",
            fontWeight: 600,
            background: "#eef2ff",
            padding: "10px 28px",
            borderRadius: 999,
          }}
        >
          AI-powered customer insights, done right
        </div>
      </div>
    ),
    { ...size }
  );
}
