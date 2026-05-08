import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const themes = [
  {
    name: "Amber",
    value: "251, 191, 36",
  },
  {
    name: "Cyan",
    value: "34, 211, 238",
  },
  {
    name: "Purple",
    value: "168, 85, 247",
  },
  {
    name: "Red",
    value: "248, 113, 113",
  },
  {
    name: "Emerald",
    value: "52, 211, 153",
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const changeTheme = (color) => {
    document.documentElement.style.setProperty(
      "--primary",
      color
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <a
            href="#"
            className="text-lg md:text-xl font-bold tracking-[0.25em] uppercase text-[rgb(var(--primary))]"
          >
            Affa<span className="text-white">.</span>
          </a>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-8">

            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm tracking-[0.25em] uppercase text-gray-300 hover:text-[rgb(var(--primary))] transition-all duration-300 relative group"
                  >
                    {link.label}

                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[rgb(var(--primary))] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>

            {/* DESKTOP THEMES */}
            <div className="relative">

              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-xs tracking-[0.25em] uppercase hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] transition-all duration-300"
              >
                Themes
              </button>

              <div
                className={`absolute top-14 right-0 transition-all duration-300 ${
                  themeOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="flex items-center gap-3 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4">

                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => changeTheme(theme.value)}
                      className="w-6 h-6 rounded-full border border-white/20 hover:scale-125 transition-transform duration-300"
                      style={{
                        background: `rgb(${theme.value})`,
                      }}
                    />
                  ))}

                </div>
              </div>

            </div>

          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden relative z-[60] flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`block w-6 h-px bg-[rgb(var(--primary))] transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />

            <span
              className={`block w-6 h-px bg-[rgb(var(--primary))] transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block w-6 h-px bg-[rgb(var(--primary))] transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>

        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

        {/* CONTENT */}
        <div className="relative h-full flex flex-col items-center justify-center px-8">

          {/* NAV LINKS */}
          <ul className="flex flex-col items-center gap-10">

            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-sm tracking-[0.35em] uppercase text-gray-300 hover:text-[rgb(var(--primary))] transition-all duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}

          </ul>

          {/* MOBILE THEMES */}
          <div className="flex flex-col items-center gap-5 mt-16">

            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500">
              Themes
            </p>

            <div className="flex items-center gap-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-6 py-4">

              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => changeTheme(theme.value)}
                  className="relative group"
                >
                  <div
                    className="w-8 h-8 rounded-full border border-white/20 transition-all duration-300 active:scale-90"
                    style={{
                      background: `rgb(${theme.value})`,
                    }}
                  />

                  <div
                    className="absolute inset-0 rounded-full blur-md opacity-40"
                    style={{
                      background: `rgb(${theme.value})`,
                    }}
                  />
                </button>
              ))}

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;