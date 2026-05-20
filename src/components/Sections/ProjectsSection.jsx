import { useState } from "react";


import { personalInfo, projects } from "../../Data/project";
import useScrollAnimation from "../ui/useScrollAnimation";
import ProjectCard from "../ui/ProjectCard";

const ProjectsSection = () => {
  const ref = useScrollAnimation();
  const [filter, setFilter] = useState("All");

  const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags))];
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  return (
    <section ref={ref} id="projects" className="animate-on-scroll py-28 px-6 bg-transparent relative overflow-hidden">



      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[rgb(var(--primary))] text-xs tracking-widest uppercase border-b border-amber-400/30 pb-2">
            My Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
            Featured <span className="text-[rgb(var(--primary))]">Projects</span>
          </h2>
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Kumpulan project yang pernah aku kerjakan — dari eksperimen kecil sampai produk nyata.
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded transition-all duration-300 ${
                filter === tag
                  ? "bg-[rgb(var(--primary))] text-black"
                  : "border bg-[rgb(var(--primary))]/10 text-gray-400 hover:border-[rgb(var(--primary))]/50 hover:text-[rgb(var(--primary))]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm tracking-widest uppercase">
              No projects found
            </p>
          </div>
        )}

        {/* GitHub CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-4">
            Mau lihat project lainnya?
          </p>
          
            <a href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-bold tracking-widest uppercase rounded hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] transition-all duration-300 hover:-translate-y-0.5"
          >
            View All on GitHub
            <span className="text-[rgb(var(--primary))]">→</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;