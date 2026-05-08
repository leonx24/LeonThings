// src/pages/Home.jsx
import { useState } from "react";

import { personalInfo, skills, projects } from "../Data/project";
import useScrollAnimation from "../components/ui/useScrollAnimation";
import ProjectCard from "../components/ui/ProjectCard";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
};

// ─── Hero Section ─────────────────────────────────────────────
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      <AnimatedBackground />

      {/* Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,191,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,191,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow tengah */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Konten */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[rgb(var(--primary))]/30 text-[rgb(var(--primary))] text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-[rgb(var(--primary))] rounded-full animate-pulse" />
          Available for Work
        </div>

        {/* Nama */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-4 leading-none">
          {/* {personalInfo.name} */} Leon
        </h1>

        {/* Tagline */}
        <p className="text-[rgb(var(--primary))] text-lg md:text-xl tracking-widest uppercase mb-6 font-light">
          {personalInfo.tagline}
        </p>

        {/* Bio */}
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {personalInfo.bio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          
            <a href="#projects"
            className="px-8 py-3 bg-[rgb(var(--primary))] text-black font-bold text-sm tracking-widest uppercase rounded hover:bg-[rgb(var(--primary))] transition-all duration-300 hover:shadow-lg hover:shadow-[rgb(var(--primary))]/30 hover:-translate-y-0.5"
          >
            View Projects
          </a>
          
            <a href="#contact"
            className="px-8 py-3 border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] transition-all duration-300 hover:-translate-y-0.5"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── About Section ─────────────────────────────────────────────
const AboutSection = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} id="about" className="animate-on-scroll py-28 px-6 bg-black relative overflow-hidden">

      <AnimatedBackground />

      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">

        {/* Kiri — Foto / Visual */}
        <div className="relative flex justify-center">
          <div className="relative w-72 h-72 md:w-80 md:h-80">

            {/* Border dekorasi */}
            <div className="absolute -inset-3 border border-amber-400/20 rounded-lg rotate-3" />
            <div className="absolute -inset-3 border border-white/5 rounded-lg -rotate-3" />

            {/* Foto atau placeholder */}
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-white/5 border border-white/10">
              {personalInfo.photo ? (
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[rgb(var(--primary))]/20 text-8xl font-bold">
                    {personalInfo.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 bg-[rgb(var(--primary))] text-black px-4 py-2 rounded text-xs font-bold tracking-widest uppercase shadow-lg">
              Web Developer
            </div>

          </div>
        </div>

        {/* Kanan — Teks */}
        <div className="flex flex-col gap-6">

          <span className="text-[rgb(var(--primary))] text-xs tracking-widest uppercase border-l-2 border-[rgb(var(--primary))] pl-3">
            About Me
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
            Crafting digital experiences that{" "}
            <span className="text-[rgb(var(--primary))]">matter</span>
          </h2>

          <p className="text-gray-400 leading-relaxed">
            {personalInfo.bio}
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { label: "Name",   value: personalInfo.name },
              { label: "Role",   value: personalInfo.tagline },
              { label: "Email",  value: personalInfo.email },
              { label: "Status", value: "Available" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-[rgb(var(--primary))]/60 text-xs tracking-widest uppercase">
                  {item.label}
                </span>
                <span className="text-white text-sm font-medium truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* CV Button */}
          {personalInfo.cv && (
            
              <a href={personalInfo.cv}
              download
              className="self-start mt-2 px-6 py-3 border bg-[rgb(var(--primary))]/50 text-black text-sm font-bold tracking-widest uppercase rounded hover:bg-[rgb(var(--primary))] hover:text-black transition-all duration-300 hover:-translate-y-0.5"
            >
              Download CV
            </a>
          )}

        </div>
      </div>
    </section>
  );
};

// ─── Skills Section ─────────────────────────────────────────────
const SkillsSection = () => {
  const ref = useScrollAnimation();

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section ref={ref} id="skills" className="animate-on-scroll py-28 px-6 bg-black relative overflow-hidden">

      <AnimatedBackground />

      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[rgb(var(--primary))]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[rgb(var(--primary))] text-xs tracking-widest uppercase border-b border-[rgb(var(--primary))]/30 pb-2">
            What I Know
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
            Skills & <span className="text-[rgb(var(--primary))]">Expertise</span>
          </h2>
        </div>

        {/* Skills grouped */}
        <div className="flex flex-col gap-12">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-[rgb(var(--primary))]/60 text-xs tracking-widest uppercase">
                  {category}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[rgb(var(--primary))]/50 hover:bg-[rgb(var(--primary))]/5 transition-all duration-300 hover:-translate-y-1 cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--primary))]/40 group-hover:bg-[rgb(var(--primary))] transition-colors duration-300 shrink-0" />
                    <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300 truncate">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/5">
          {[
            { number: "2+",              label: "Years Experience" },
            { number: skills.length + "+", label: "Technologies" },
            { number: "2",             label: "Projects Done" },
            { number: "100%",            label: "Dedication" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-3xl md:text-4xl font-bold text-[rgb(var(--primary))] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </p>
              <p className="text-gray-500 text-xs tracking-widest uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// ─── Projects Section ─────────────────────────────────────────────
const ProjectsSection = () => {
  const ref = useScrollAnimation();
  const [filter, setFilter] = useState("All");

  const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags))];
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  return (
    <section ref={ref} id="projects" className="animate-on-scroll py-28 px-6 bg-black relative overflow-hidden">

      <AnimatedBackground />

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

// ─── Contact Section ─────────────────────────────────────────────
const ContactSection = () => {
  const ref = useScrollAnimation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 4000);
    }, 1500);
  };

  return (
    <section ref={ref} id="contact" className="animate-on-scroll py-28 px-6 bg-black relative overflow-hidden">

      <AnimatedBackground />

      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgb(var(--primary))]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start relative z-10">

        {/* Kiri — Info */}
        <div className="flex flex-col gap-6">

          <span className="text-[rgb(var(--primary))] text-xs tracking-widest uppercase border-l-2 border-[rgb(var(--primary))] pl-3">
            Get In Touch
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
            Let's work <span className="text-[rgb(var(--primary))]">together</span>
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Punya project menarik atau ingin berkolaborasi? Jangan ragu untuk menghubungi aku. Aku selalu terbuka untuk peluang baru.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-4 mt-2">
            {[
              { label: "Email",    value: personalInfo.email, href: `mailto:${personalInfo.email}` },
              { label: "GitHub",   value: "github.com/" + personalInfo.github?.split("/").pop(), href: personalInfo.github },
              { label: "LinkedIn", value: "linkedin.com/in/" + personalInfo.linkedin?.split("/").pop(), href: personalInfo.linkedin },
            ].map((item) =>
              item.href && (
                
                  <a key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[rgb(var(--primary))]/50 hover:bg-[rgb(var(--primary))]/5 transition-all duration-300"
                >
                  <span className="text-[rgb(var(--primary))]/60 text-xs tracking-widest uppercase w-16 shrink-0">
                    {item.label}
                  </span>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 truncate">
                    {item.value}
                  </span>
                  <span className="ml-auto text-[rgb(var(--primary))] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    →
                  </span>
                </a>
              )
            )}
          </div>
        </div>

        {/* Kanan — Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[rgb(var(--primary))]/60 tracking-widest uppercase">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nama kamu"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:bg-[rgb(var(--primary))]/5 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[rgb(var(--primary))]/60 tracking-widest uppercase">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@kamu.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:bg-[rgb(var(--primary))]/5 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[rgb(var(--primary))]/60 tracking-widest uppercase">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Ceritain project atau ide kamu..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:bg-[rgb(var(--primary))]/5 transition-all duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full py-3 text-sm font-bold tracking-widest uppercase rounded transition-all duration-300 ${
              status === "sending"
                ? "bg-[rgb(var(--primary))] text-black cursor-not-allowed"
                : "bg-[rgb(var(--primary))] text-black hover:bg-[rgb(var(--primary))] hover:shadow-lg hover:shadow-[rgb(var(--primary))]/30 hover:-translate-y-0.5"
            }`}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-center text-green-400 text-sm tracking-wide animate-fade-in">
              ✓ Pesan terkirim! Aku akan segera membalas.
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-red-400 text-sm tracking-wide animate-fade-in">
              ✗ Gagal mengirim. Coba lagi ya.
            </p>
          )}

        </form>
      </div>
    </section>
  );
};

export default Home;