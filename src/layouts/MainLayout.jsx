import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;