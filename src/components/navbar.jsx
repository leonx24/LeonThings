import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault()
      if (window.lenis) {
        window.lenis.scrollTo("#hero")
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

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
      href: isHome ? "#about" : "/#about",
      isHash: true,
    },
    {
      name: "Works",
      href: isHome ? "#works" : "/#works",
      isHash: true,
    },
    {
      name: "Bot",
      href: "/bot",
      isHash: false,
    },
    {
      name: "Services",
      href: isHome ? "#services" : "/#services",
      isHash: true,
    },
    {
      name: "Contact",
      href: isHome ? "#contact" : "/#contact",
      isHash: true,
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
        <Link
          to="/"
          onClick={handleLogoClick}
          className="
            font-mono

            text-[11px]
            uppercase
            tracking-[0.18em]

            text-white/60
            hover:text-white
            transition-colors
            duration-300
          "
        >
          Leon
        </Link>

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
          {links.map((link) => {
            const isRouterLink = !link.isHash || !isHome
            return (
              <li key={link.name}>
                {isRouterLink ? (
                  <Link
                    to={link.href}
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
                  </Link>
                ) : (
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
                )}
              </li>
            )
          })}
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
          {links.map((link) => {
            const isRouterLink = !link.isHash || !isHome
            return isRouterLink ? (
              <Link
                key={link.name}
                to={link.href}
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
              </Link>
            ) : (
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
            )
          })}
        </div>
      </div>
    </nav>
  )
}