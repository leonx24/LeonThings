const ProjectCard = ({ project }) => {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/3
        backdrop-blur-xl
        transition-all
        duration-700
        hover:-translate-y-2
        hover:border-[rgb(var(--primary))]/20
      "
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden h-260px">

        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="
              h-full
              w-full
              object-cover
              brightness-75
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              bg-linear-to-br
              from-white/3
              to-white/1
            "
          >
            <span
              className="
                text-6xl
                font-semibold
                text-white/10
              "
            >
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            gap-3
            bg-black/40
            opacity-0
            backdrop-blur-sm
            transition-all
            duration-500
            group-hover:opacity-100
          "
        >
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-full
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
                text-black
                transition-all
                duration-500
                hover:bg-zinc-200
              "
            >
              Live Demo
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="
                rounded-full
                border
                border-white/10
                bg-white/3
                px-5
                py-2.5
                text-sm
                text-white
                transition-all
                duration-500
                hover:bg-white/6
              "
            >
              Github
            </a>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-7">

        <h3
          className="
            text-xl
            font-semibold
            text-white
          "
        >
          {project.title}
        </h3>

        <p
          className="
            mt-4
            leading-7
            text-zinc-400
          "
        >
          {project.description}
        </p>

        {/* TAGS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                border
                border-white/10
                bg-white/3
                px-3
                py-1
                text-xs
                text-zinc-300
              "
            >
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;