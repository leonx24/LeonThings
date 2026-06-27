import Home from "./pages/home"
import ProjectDetail from "./pages/ProjectDetail"
import BotConsole from "./pages/BotConsole"
import NotFound from "./pages/NotFound"
import { Routes, Route } from "react-router-dom"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:slug" element={<ProjectDetail />} />
      <Route path="/bot" element={<BotConsole />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}