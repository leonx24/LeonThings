import GridLines from "../components/gridLines"
import Navbar from "../components/navbar"

import Hero from "../components/hero"
import Divider from "../components/divider"

import About from "../components/about"
import Works from "../components/work"
import Services from "../components/services"
import Quote from "../components/quote"
import Contact from "../components/contact"
import Noise from "../components/noise"

import Footer from "../components/footer"

export default function Home() {
  return (
    <>
      <Noise />
      <GridLines />
      <Navbar />

      <Hero />

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