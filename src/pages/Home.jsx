import HeroSection from "../components/Sections/HeroSection";
import AboutSection from "../components/Sections/AboutSection";
import SkillsSection from "../components/Sections/SkillsSection";
import ProjectsSection from "../components/Sections/ProjectsSection";

import ContactSection from "../components/Sections/ContactSection";



const Home = () => {
  return (
    <main
      className="
        relative
        z-10
        overflow-x-hidden
      "
    >
      {/* HERO */}
      <HeroSection />

      {/* ABOUT */}
      <AboutSection />

      {/* PROJECTS */}
      <ProjectsSection />

      {/* SKILLS */}
      <SkillsSection />

      {/* CONTACT */}
      <ContactSection />

    </main>
  );
};

export default Home;