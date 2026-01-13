import { ImageResponse } from "next/og"

export const runtime = "nodejs"

export async function GET(request: Request, { params }: { params: Promise<{ hex: string }> }) {
  const { hex: paramHex } = await params
  const rawHex = paramHex || ""
  const hex = normalizeHex(rawHex)
  
  // Import the known color hexes from a pre-built small file to stay under Edge Function size limits
  const { isKnownColor } = await import('@/lib/known-colors-complete');
  
  const cleanHex = hex.replace('#', '').toUpperCase();
  const colorExists = isKnownColor(cleanHex);
  
  if (!colorExists) {
    // For unknown hex values, return a 404 to avoid serverless execution
    // The client will handle image generation
    return new Response(null, {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      }, 
    });
  }

  if (!isValidHex(hex)) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 64,
          }}
        >
          Invalid Color
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const rgb = hexToRgb(hex)
  if (!rgb) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 64,
          }}
        >
          Invalid Color
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const rgbText = `RGB(${rgb.r},${rgb.g},${rgb.b})`
  const textColor = getContrastColor(hex)
  const watermarkFill = textColor === "#FFFFFF" ? "#FFFFFF" : "#000000"

  // Load fonts from remote source since local files are removed
  // Using fontsource.org for reliable immutable versions
  let fontRegular: ArrayBuffer | null = null
  let fontBold: ArrayBuffer | null = null

  try {
    const [regularData, boldData] = await Promise.all([
      fetch("https://api.fontsource.org/v1/fonts/inter/latin-400-normal.woff").then((res) =>
        res.ok ? res.arrayBuffer() : null
      ),
      fetch("https://api.fontsource.org/v1/fonts/inter/latin-700-normal.woff").then((res) =>
        res.ok ? res.arrayBuffer() : null
      ),
    ])
    fontRegular = regularData
    fontBold = boldData
  } catch (e) {
    console.error("Failed to load fonts:", e)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: hex,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: fontRegular && fontBold ? "CM-OG" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-20px" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: textColor,
              letterSpacing: "0.05em",
              marginBottom: 20,
            }}
          >
            {hex.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 400,
              color: textColor,
              letterSpacing: "0em",
            }}
          >
            {rgbText}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 40,
            fontWeight: 700,
            color: watermarkFill,
            opacity: 0.35,
          }}
        >
          ColorMean
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts:
        fontRegular && fontBold
          ? [
              {
                name: "CM-OG",
                data: fontRegular,
                style: "normal",
                weight: 400,
              },
              {
                name: "CM-OG",
                data: fontBold,
                style: "normal",
                weight: 700,
              },
            ]
          : undefined,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  )
}

// Utility functions inline
function normalizeHex(hex: string): string {
  hex = hex.replace("#", "")
  return "#" + hex.toUpperCase()
}

function isValidHex(hex: string): boolean {
  return /^#?[0-9A-F]{6}$/i.test(hex)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#000000"
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? "#000000" : "#FFFFFF"
}
