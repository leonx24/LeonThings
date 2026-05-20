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
        py-32
      "
    >
      {/* AMBIENT LIGHT */}
      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-450px
          w-450px
          rounded-full
          bg-cyan-500/5
          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-7xl
          items-center
          gap-24
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
            max-w-md
          "
        >

          {/* GLOW */}
          <div
            className="
              absolute
              inset-0
              rounded-4xl
              bg-cyan-500/8
              blur-[80px]
            "
          />

          {/* IMAGE CARD */}
          <div
            className="
              relative
              overflow-hidden
              rounded-4xl
              border
              border-white/10
              bg-white/3
              backdrop-blur-xl
            "
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.name}
                className="
                  h-600px
                  w-full
                  object-cover
                  brightness-90
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-600px
                  items-center
                  justify-center
                  bg-white/3
                "
              >
                <span
                  className="
                    text-8xl
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
                from-black/50
                via-transparent
                to-transparent
              "
            />
          </div>

        </div>

        {/* RIGHT */}
        <div>

          {/* LABEL */}
          <p
            className="
              mb-5
              text-sm
              uppercase
              tracking-[0.2em]
              text-cyan-400
            "
          >
            About Me
          </p>

          {/* TITLE */}
          <h2
            className="
              text-4xl
              font-bold
              leading-tight
              text-white
              md:text-5xl
            "
          >
            Crafting modern digital experiences with elegance and precision.
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-8
              text-lg
              leading-8
              text-zinc-400
            "
          >
            {personalInfo.bio}
          </p>

          <p
            className="
              mt-6
              text-lg
              leading-8
              text-zinc-400
            "
          >
            I focus on building interfaces that feel
            minimal, premium, and intuitive while keeping
            performance and user experience at the center
            of every project.
          </p>

          {/* INFO GRID */}
          <div
            className="
              mt-12
              grid
              gap-5
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
                  p-5
                  backdrop-blur-xl
                "
              >
                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    text-zinc-500
                  "
                >
                  {item.label}
                </p>

                <p
                  className="
                    mt-3
                    text-white
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
                mt-10
                inline-flex
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