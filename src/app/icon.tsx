import { ImageResponse } from "next/og";

/**
 * Browser-tab icon.
 *
 * Replaces the Next.js starter favicon.ico that shipped with create-next-app.
 * `icon.tsx` is generated at build time and served at a hashed URL; the old
 * app/favicon.ico had to be deleted for this to take effect, because a
 * favicon.ico in the app directory outranks a generated icon.
 *
 * The mark is the logo reduced to what survives at 32px: the wordmark's first
 * letter plus the yellow dot that follows "edgebrain" everywhere else on the
 * site. The full wordmark is illegible at this size, and a tab icon that
 * cannot be told apart from its neighbours has failed at its only job.
 *
 * No web font is fetched, matching src/lib/og.tsx — a favicon that blocks on a
 * network request is worse than one drawn in a system font.
 */

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
          // --color-ink. Reads as a solid dark tile in both light and dark
          // browser chrome, unlike a transparent mark which disappears in one.
          background: "#0E0E0E",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            // Optical centring: the dot adds weight on the right, so the pair
            // sits slightly left of true centre to look centred.
            transform: "translateX(-1px)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#FAFAFA",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            e
          </div>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              // --color-yellow, the same accent that trails the wordmark.
              background: "#FFD400",
              marginLeft: 1.5,
              marginBottom: 1,
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
