import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1, #4338ca)",
          borderRadius: 9,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <path
            d="M10 20.5c0-3.5 2.7-6.3 6-6.3s6 2.8 6 6.3"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="16" cy="10.8" r="3.4" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
