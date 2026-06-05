export default function GridLines() {
  return (
    <div
      className="
        fixed
        inset-0

        pointer-events-none

        z-0

        hidden
        lg:flex

        justify-between

        px-16
      "
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="
            w-px
            h-full

            bg-white/[0.07]
          "
        />
      ))}
    </div>
  )
}