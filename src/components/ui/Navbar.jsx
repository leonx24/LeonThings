import { useEffect, useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          fixed
          top-4
          left-1/2
          -translate-x-1/2
          z-50
          w-[95%]
          max-w-6xl
          transition-all
          duration-500
          ${
            scrolled
              ? `
                border border-white/10
                bg-black/30
                backdrop-blur-2xl
                shadow-[0_0_50px_rgba(34,211,238,0.05)]
              `
              : `
                bg-transparent
              `
          }
          rounded-2xl
        `}
      >
        <div
          className="
            relative
            flex
            items-center
            justify-between
            px-6
            py-4
          "
        >
          {/* SUBTLE OVERLAY */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-2xl
              bg-white/2
            "
          />

          {/* LOGO */}
          <a
            href="#"
            className="
              relative
              z-10
              text-lg
              font-semibold
              tracking-wide
              text-white
            "
          >
            LEON
          </a>

          {/* DESKTOP NAV */}
          <div
            className="
              relative
              z-10
              hidden
              items-center
              gap-10
              md:flex
            "
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-sm
                  text-zinc-400
                  transition-colors
                  duration-500
                  hover:text-white
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
              <a
        href="#contact"
        className="
          rounded-full
          border
          border-white/10
          bg-white
          px-5
          py-2
          text-sm
          font-medium
          text-black
          transition-all
          duration-500
          hover:scale-[1.03]
          hover:bg-zinc-200
        "
      >
        Let's Talk
      </a>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              relative
              z-10
              flex
              flex-col
              gap-1.5
              md:hidden
            "
            aria-label="Toggle Menu"
          >
            <span
              className={`
                h-px
                w-6
                bg-white
                transition-all
                duration-500
                ${
                  menuOpen
                    ? "translate-y-7px rotate-45"
                    : ""
                }
              `}
            />

            <span
              className={`
                h-px
                w-6
                bg-white
                transition-all
                duration-500
                ${
                  menuOpen
                    ? "opacity-0"
                    : ""
                }
              `}
            />

            <span
              className={`
                h-px
                w-6
                bg-white
                transition-all
                duration-500
                ${
                  menuOpen
                    ? "-translate-y-7px -rotate-45"
                    : ""
                }
              `}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed
          top-24
          right-4
          z-40
          w-300px
          transition-all
          duration-500
          md:hidden
          ${
            menuOpen
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-4"
          }
        `}
      >
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-black/60
            backdrop-blur-2xl
            shadow-[0_0_40px_rgba(34,211,238,0.05)]
          "
        >
          <div
            className="
              flex
              flex-col
              p-6
            "
          >
            {/* LINKS */}
            <div
              className="
                flex
                flex-col
                gap-6
              "
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  className="
                    text-sm
                    text-zinc-300
                    transition-colors
                    duration-500
                    hover:text-white
                  "
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;