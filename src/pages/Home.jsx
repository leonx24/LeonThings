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
      "
    >
      {/* HERO */}
      <HeroSection />

      {/* ABOUT */}
      <AboutSection />

      {/* PROJECTS */}
      <SkillsSection />


      {/* SKILLS */}
      <ProjectsSection />

      {/* CONTACT */}
      <ContactSection />

    </main>
  );
};

export default Home;