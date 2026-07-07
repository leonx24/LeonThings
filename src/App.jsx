import { useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import Home from "./pages/home"
import ProjectDetail from "./pages/ProjectDetail"
import BotConsole from "./pages/BotConsole"
import NotFound from "./pages/NotFound"
import Preloader from "./components/Preloader"
import PageTransition from "./components/PageTransition"

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(() => {
    // Check if preloader has already been shown in this browser session
    return sessionStorage.getItem("preloader_seen") === "true"
  })
  const location = useLocation()

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("preloader_seen", "true")
    setPreloaderDone(true)
  }

  return (
    <>
      {/* Premium Preloader — shown on first visit */}
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Page Transition Wrapper */}
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/bot" element={<BotConsole />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </>
  )
}