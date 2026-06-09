import { useState, useEffect, useRef } from "react"

export default function LazyImage({ src, alt, className, priority = false }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: "50px",
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [priority])

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          className={`
            w-full
            h-full
            object-cover
            transition-opacity
            duration-500
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
        />
      )}

      {!isLoaded && (
        <div
          className="
            w-full
            h-full
            bg-white/[0.02]
            animate-pulse
          "
        />
      )}
    </div>
  )
}
