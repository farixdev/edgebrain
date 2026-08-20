import { ImageResponse } from "next/og";

/**
 * Shared renderer for every `opengraph-image` route in the app.
 *
 * The site declared `twitter: { card: "summary_large_image" }` on the root
 * layout and three page files while shipping no image at all, so every share
 * to Slack, LinkedIn, X, or iMessage rendered as a bare text stub. One
 * generator here keeps the cards consistent and means a route only has to
 * declare its own eyebrow and headline.
 *
 * Drawn with the palette from globals.css. No web fonts are fetched — the font
 * bundled with `next/og` is used — so the build never depends on the network.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0e0e0e";
const OFFWHITE = "#fafafa";
const YELLOW = "#ffd400";
const MUTE = "#9a9a9a";

export function renderOgImage({
  eyebrow,
  title,
  footer = "edgebrainstudios.com",
}: {
  eyebrow: string;
  title: string;
  footer?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          color: OFFWHITE,
          padding: "72px 80px",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              backgroundColor: YELLOW,
            }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            EdgeBrain Studios
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: YELLOW,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 52 ? 62 : 76,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer rule */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              height: 2,
              backgroundColor: "#232323",
              marginBottom: 24,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: MUTE,
            }}
          >
            <div style={{ display: "flex" }}>{footer}</div>
            <div style={{ display: "flex" }}>Lahore, Pakistan</div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
