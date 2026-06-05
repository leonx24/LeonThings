export default function Footer() {
  return (
    <footer
      className="
        px-8
        lg:px-16

        py-10

        border-t
        border-white/[0.07]

        flex
        flex-col
        gap-4

        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <span
        className="
          font-mono

          uppercase
          tracking-[0.18em]
          text-[10px]

          text-white/35
        "
      >
        © 2026 LeonThings
      </span>

      <a
        href="#hero"
        className="
          font-mono

          uppercase
          tracking-[0.18em]
          text-[10px]

          text-white/35

          transition-colors
          duration-300

          hover:text-white
        "
      >
        Back To Top ↑
      </a>
    </footer>
  )
}