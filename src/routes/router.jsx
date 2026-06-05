import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from "../pages/home"
import Project from "../pages/project"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/project/:slug"
          element={<Project />}
        />
      </Routes>
    </BrowserRouter>
  )
}