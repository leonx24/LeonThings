import { personalInfo } from "../../Data/project";
   

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <p className="text-[rgb(var(--primary))] font-bold tracking-widest uppercase text-sm">
          {personalInfo.name}<span className="text-white">.</span>
        </p>

        {/* Copyright */}
        <p className="text-gray-500 text-xs tracking-widest">
          © {currentYear} {personalInfo.name}. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          {personalInfo.github && (
            
              <a href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[rgb(var(--primary))] transition-colors duration-300 text-xs tracking-widest uppercase"
            >
              GitHub
            </a>
          )}
          {personalInfo.linkedin && (
            
              <a href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[rgb(var(--primary))] transition-colors duration-300 text-xs tracking-widest uppercase"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.email && (
            
              <a href={`mailto:${personalInfo.email}`}
              className="text-gray-500 hover:text-[rgb(var(--primary))] transition-colors duration-300 text-xs tracking-widest uppercase"
            >
              Email
            </a>
          )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;