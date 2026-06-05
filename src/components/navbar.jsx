import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const links = [
    {
      name: "About",
      href: "#about",
    },
    {
      name: "Works",
      href: "#works",
    },
    {
      name: "Services",
      href: "#services",
    },
    {
      name: "Contact",
      href: "#contact",
    },
  ]

  return (
    <nav
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50

        transition-all
        duration-500
        ease-out

        ${
          scrolled
            ? "bg-black"
            : ""
        }
      `}
    >
      <div
        className="
          px-8
          lg:px-16

          py-6

          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            font-mono

            text-[11px]
            uppercase
            tracking-[0.18em]

            text-white/60
          "
        >
          Leon
        </span>

        <ul
          className="
            hidden
            md:flex

            gap-11

            font-mono
            text-[11px]

            uppercase
            tracking-[0.18em]
          "
        >
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="
                  relative

                  text-white/35

                  transition-all
                  duration-500
                  ease-out

                  hover:text-white

                  after:absolute
                  after:left-0
                  after:-bottom-1

                  after:h-px
                  after:w-0

                  after:bg-white

                  after:transition-all
                  after:duration-300
                  after:ease-out

                  hover:after:w-full
                "
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="
            md:hidden

            text-white/60

            transition-colors
            duration-300

            hover:text-white
          "
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={`
          md:hidden

          overflow-hidden

          transition-all
          duration-500
          ease-out

          ${
            open
              ? "max-h-80 border-black"
              : "max-h-0"
          }
        `}
      >
        <div className="bg-black/95 backdrop-blur-xl">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                block

                px-8
                py-4

                font-mono
                text-[11px]

                uppercase
                tracking-[0.18em]

                text-white/35

                transition-colors
                duration-300

                hover:text-white
              "
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}