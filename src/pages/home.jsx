import { useEffect } from "react"
import GridLines from "../components/gridLines"
import Navbar from "../components/navbar"
import SEO from "../components/SEO"

import { PixelHero } from "../components/ui/pixel-perfect-hero"
import Divider from "../components/divider"

import About from "../components/about"
import Works from "../components/work"
import RobloxPlayground from "../components/RobloxPlayground"
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
      <SEO
        title={null}
        description="Creative developer building modern web experiences and scalable game systems. Specializing in React, Python, and Roblox development."
        path="/"
      />
      <CustomCursor />
      <Noise />
      <GridLines />
      <Navbar />

      <main id="main-content">
        <PixelHero
          word1="Creative"
          word2="Developer."
          description="I write code that runs fast, keep my interfaces minimal, and build neat software. Usually working with React, Luau, and Python. Currently engineering scripting clients and automation bots."
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

        <Divider />

        <RobloxPlayground />

        <Divider />

        <Services />

        <Quote />

        <Contact />
      </main>

      <Footer />
    </>
  )
}