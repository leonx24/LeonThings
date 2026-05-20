import { personalInfo } from "../../Data/project";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-white/5
        py-16
      "
    >

      {/* AMBIENT LIGHT */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-300px
          w-600px
          -translate-x-1/2
          rounded-full
          bg-cyan-500/3
          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-7xl
          flex-col
          items-center
          justify-between
          gap-10
          px-6
          md:flex-row
        "
      >

        {/* LEFT */}
        <div className="text-center md:text-left">

          {/* LOGO */}
          <h2
            className="
              text-xl
              font-semibold
              tracking-wide
              text-white
            "
          >
            {personalInfo.name}
          </h2>

          {/* TEXT */}
          <p
            className="
              mt-3
              max-w-md
              text-sm
              leading-7
              text-zinc-500
            "
          >
            Building modern and elegant digital
            experiences with focus on clean design,
            interaction, and performance.
          </p>

        </div>

        {/* RIGHT */}
        <div
          className="
            flex
            flex-col
            items-center
            gap-6
            md:items-end
          "
        >

          {/* SOCIALS */}
          <div
            className="
              flex
              items-center
              gap-6
            "
          >

            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-sm
                  text-zinc-500
                  transition-all
                  duration-500
                  hover:text-white
                "
              >
                Github
              </a>
            )}

            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-sm
                  text-zinc-500
                  transition-all
                  duration-500
                  hover:text-white
                "
              >
                LinkedIn
              </a>
            )}

            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="
                  text-sm
                  text-zinc-500
                  transition-all
                  duration-500
                  hover:text-white
                "
              >
                Email
              </a>
            )}

          </div>

          {/* COPYRIGHT */}
          <p
            className="
              text-sm
              text-zinc-600
            "
          >
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;