import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

import AnimatedBackground from "./components/ui/AnimatedBackground";

import CustomCursor from "./components/ui/CustomCursor"
import ScrollProgress from "./components/ui/ScrollProgress";
import SEO from "./components/ui/SEO";

const App = () => {
  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[#09090B]
        text-white
      "
    >
        <SEO />
      {/* BACKGROUND */}
      <AnimatedBackground />

      {/* PREMIUM UI EFFECTS */}
      <CustomCursor />

      <ScrollProgress />

      {/* CONTENT */}
      <MainLayout>
        <Home />
      </MainLayout>
    </div>
  );
};

export default App;