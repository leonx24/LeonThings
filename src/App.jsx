import Home from "./pages/home"
import ProjectDetail from "./pages/ProjectDetail"
import { Routes, Route } from "react-router-dom"
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:slug" element={<ProjectDetail />} />
    </Routes>
  )
}