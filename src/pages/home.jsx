import { useEffect } from "react"
import GridLines from "../components/gridLines"
import Navbar from "../components/navbar"

import { PixelHero } from "../components/ui/pixel-perfect-hero"
import Divider from "../components/divider"

import About from "../components/about"
import Works from "../components/work"
import Services from "../components/services"
import Quote from "../components/quote"
import Contact from "../components/contact"
import Noise from "../components/noise"
import CustomCursor from "../components/CustomCursor"

import Footer from "../components/footer"

import useSmoothScroll from "../hooks/useSmoothScroll"

export default function Home() {
  useSmoothScroll()

  useEffect(() => {
    // If navigating back to homepage with a hash (e.g. /#works), scroll to it smoothly
    const hash = window.location.hash
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el)
          } else {
            el.scrollIntoView({ behavior: "smooth" })
          }
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Noise />
      <GridLines />
      <Navbar />

      <PixelHero
        word1="Creative"
        word2="Developer."
        description="I develop responsive React web applications, write custom backend integrations, and engineer game systems in Roblox. Focused on making things that look clean and run fast."
        primaryCta="Explore Design"
        primaryCtaMobile="Explore"
        secondaryCta="View GitHub"
        secondaryCtaMobile="GitHub"
        onPrimaryClick={() => {
          if (window.lenis) {
            window.lenis.scrollTo("#works")
          } else {
            const el = document.getElementById("works")
            if (el) el.scrollIntoView({ behavior: "smooth" })
          }
        }}
        githubUrl="https://github.com/leonx24"
      />

      <Divider />

      <About />

      <Works />

      <Services />

      <Quote />

      <Contact />

      <Footer />
    </>
  )
}