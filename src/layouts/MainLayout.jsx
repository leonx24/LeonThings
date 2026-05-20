import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-transparent text-white font-sans">
      <Navbar />

      <main className="relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;