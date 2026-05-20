import useScrollAnimation from "../ui/useScrollAnimation";
import { skills } from "../../Data/project";

const SkillsSection = () => {
  const ref = useScrollAnimation();

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section
      ref={ref}
      id="skills"
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
          bottom-0
          left-0
          h-400px
          w-400px
          rounded-full
          bg-cyan-500/5
          blur-[120px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="mb-24 text-center">

          <p
            className="
              mb-5
              text-sm
              uppercase
              tracking-[0.2em]
              text-cyan-400
            "
          >
            Toolset
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-white
              md:text-5xl
            "
          >
            Skills & Expertise
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-lg
              leading-8
              text-zinc-400
            "
          >
            Technologies and tools I use to craft
            modern, elegant, and performant digital
            experiences.
          </p>

        </div>

        {/* GROUPS */}
        <div className="space-y-20">

          {Object.entries(grouped).map(
            ([category, items]) => (
              <div key={category}>

                {/* CATEGORY */}
                <div
                  className="
                    mb-8
                    flex
                    items-center
                    gap-5
                  "
                >
                  <p
                    className="
                      text-sm
                      uppercase
                      tracking-[0.2em]
                      text-cyan-400
                    "
                  >
                    {category}
                  </p>

                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* SKILLS */}
                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                  "
                >
                  {items.map((skill) => (
                    <div
                      key={skill.name}
                      className="
                        group
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/3
                        p-5
                        backdrop-blur-xl
                        transition-all
                        duration-500
                        hover:-translate-y-1
                        hover:border-cyan-400/20
                        hover:bg-white/5
                      "
                    >
                      <div className="flex items-center gap-3">

                        {/* DOT */}
                        <div
                          className="
                            h-2
                            w-2
                            rounded-full
                            bg-cyan-400/50
                            transition-all
                            duration-500
                            group-hover:bg-cyan-400
                            group-hover:shadow-[0_0_12px_rgba(34,211,238,0.8)]
                          "
                        />

                        {/* NAME */}
                        <p
                          className="
                            text-sm
                            font-medium
                            text-zinc-300
                            transition-colors
                            duration-500
                            group-hover:text-white
                          "
                        >
                          {skill.name}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )
          )}
        </div>

        {/* STATS */}
        <div
          className="
            mt-28
            grid
            gap-6
            border-t
            border-white/5
            pt-16
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {[
            {
              number: "2+",
              label: "Years Experience",
            },

            {
              number: `${skills.length}+`,
              label: "Technologies",
            },

            {
              number: "10+",
              label: "Projects Built",
            },

            {
              number: "100%",
              label: "Dedication",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/2
                p-8
                text-center
                backdrop-blur-xl
              "
            >
              <p
                className="
                  text-4xl
                  font-bold
                  text-white
                "
              >
                {stat.number}
              </p>

              <p
                className="
                  mt-3
                  text-sm
                  uppercase
                  tracking-[0.15em]
                  text-zinc-500
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;