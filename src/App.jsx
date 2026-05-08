import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import CustomCursor from "./components/ui/CustomCursor";
import AnimatedBackground from "./components/ui/AnimatedBackground";

const App = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
    <MainLayout>
      <AnimatedBackground />
      <CustomCursor/> 
      <Home />
    </MainLayout>
    </div>
  );
};

export default App;