import { personalInfo } from "../../Data/project";
import useScrollAnimation from "../ui/useScrollAnimation";

const AboutSection = () => {
  const ref = useScrollAnimation();

  return (
    <section
      ref={ref}
      id="about"
      className="
        animate-on-scroll
        relative
        overflow-hidden
        py-24
      "
    >
      {/* SUBTLE AMBIENT */}
      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-450px
          w-450px
          rounded-full
          bg-cyan-500/4
          blur-[90px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-6xl
          items-center
          gap-14
          px-6
          lg:grid-cols-2
        "
      >
        {/* LEFT */}
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-sm
          "
        >
          {/* GLOW */}
          <div
            className="
              absolute
              inset-0
              rounded-4xl
              bg-cyan-500/6
              blur-[60px]
            "
          />

          {/* IMAGE */}
          <div
            className="
              relative
              overflow-hidden
              rounded-4xl
              border
              border-white/10
              bg-white/3
              backdrop-blur-md
            "
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.name}
                className="
                  h-480px
                  w-full
                  object-cover
                  brightness-95
                  transition-transform
                  duration-700
                  hover:scale-[1.02]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-480px
                  items-center
                  justify-center
                  bg-white/3
                "
              >
                <span
                  className="
                    text-7xl
                    font-semibold
                    text-white/10
                  "
                >
                  {personalInfo.name.charAt(0)}
                </span>
              </div>
            )}

            {/* OVERLAY */}
            <div
              className="
                absolute
                inset-0
                bg-linear-to-t
                from-black/40
                via-transparent
                to-transparent
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="max-w-2xl">
          {/* LABEL */}
          <p
            className="
              mb-4
              text-xs
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            About Me
          </p>

          {/* TITLE */}
          <h2
            className="
              text-3xl
              font-semibold
              leading-tight
              tracking-tight
              text-white
              md:text-4xl
            "
          >
            Designing clean and modern digital experiences.
          </h2>

            {/* DESCRIPTION */}
            <p
            className="
                mt-6
                text-base
                leading-7
                text-zinc-400
                md:text-lg
            "
            >
            {personalInfo.bio} I enjoy building interfaces that feel
            elegant, minimal, and intuitive while maintaining strong
            performance and a smooth user experience across every
            interaction.
            </p>

          {/* INFO GRID */}
          <div
            className="
              mt-8
              grid
              gap-4
              sm:grid-cols-2
            "
          >
            {[
              {
                label: "Name",
                value: personalInfo.name,
              },

              {
                label: "Role",
                value: personalInfo.tagline,
              },

              {
                label: "Email",
                value: personalInfo.email,
              },

              {
                label: "Status",
                value: "Available",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/3
                  p-4
                  backdrop-blur-md
                "
              >
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-zinc-500
                  "
                >
                  {item.label}
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    text-white
                    md:text-base
                  "
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          {personalInfo.cv && (
            <a
              href={personalInfo.cv}
              download
              className="
                mt-8
                inline-flex
                items-center
                rounded-full
                bg-white
                px-6
                py-3
                text-sm
                font-medium
                text-black
                transition-all
                duration-500
                hover:bg-zinc-200
              "
            >
              Download CV
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;