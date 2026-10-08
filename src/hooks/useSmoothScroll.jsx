import { useEffect } from "react"
import Lenis from "lenis"

export default function useSmoothScroll() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Expose lenis instance globally for programmatic access
    window.lenis = lenis

    // Animation loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Global click listener to intercept hash links
    const handleHashClick = (e) => {
      const targetLink = e.target.closest("a")
      if (!targetLink) return

      const href = targetLink.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const targetElement = document.querySelector(href)
        if (targetElement) {
          lenis.scrollTo(targetElement)
        }
      }
    }

    document.addEventListener("click", handleHashClick)

    // Cleanup
    return () => {
      document.removeEventListener("click", handleHashClick)
      window.lenis = null
      lenis.destroy()
    }
  }, [])
}
