import { useMemo } from "react"

// Pre-bake a tiny 128x128 tileable noise texture once instead of running
// a full-viewport SVG <feTurbulence> filter on the GPU every 60fps frame.
function createNoiseDataUri() {
  if (typeof document === "undefined") return ""
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  const imgData = ctx.createImageData(128, 128)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.floor(Math.random() * 255)
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 28 // Subtle grain alpha baked directly
  }
  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL("image/png")
}

export default function Noise() {
  const noiseUrl = useMemo(() => createNoiseDataUri(), [])

  if (!noiseUrl) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-1 opacity-35"
      style={{
        backgroundImage: `url(${noiseUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  )
}
