const ProjectCard = ({ project }) => {
  return (
    <div className="group relative bg-white/5.5 border border-[rgb(var(--primary))]/10 rounded-lg overflow-hidden hover:border-[rgb(var(--primary))]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[rgb(var(--primary))]/10">

      {/* Image */}
      <div className="relative overflow-hidden h-48">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          // Placeholder kalau belum ada gambar
          <div className="w-full h-full bg-gradient-to-br from-[rgb(var(--primary))]/10 to-white/5 flex items-center justify-center">
            <span className="text-[rgb(var(--primary))]/30 text-5xl font-bold tracking-widest">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay saat hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          {project.demo && (
            
              <a href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[rgb(var(--primary))]/50 text-black text-xs font-bold tracking-widest uppercase rounded hover:bg-[rgb(var(--primary))] transition-colors duration-300"
            >
              Live Demo
            </a>
          )}
          {project.github && (
            
              <a href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white text-white text-xs font-bold tracking-widest uppercase rounded hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] transition-colors duration-300"
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg tracking-wide mb-2 group-hover:text-[rgb(var(--primary))] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4  ">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-[rgb(var(--primary))]/10 text-white border border-[rgb(var(--primary))]/20 rounded tracking-wide"
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