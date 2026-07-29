import noiseImg from "../assets/images/noise.png"

export default function Noise() {
  return (
    <div
      className="
        fixed
        inset-0

        pointer-events-none

        z-1

        opacity-[0.015]
      "
      style={{
        backgroundImage: `url('${noiseImg}')`,
        backgroundRepeat: "repeat",

      }}
    />
  )
}