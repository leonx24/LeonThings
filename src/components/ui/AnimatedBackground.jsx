// src/components/ui/AnimatedBackground.jsx

import { useEffect, useState } from "react";

const AnimatedBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shapes = [
    // BIG CIRCLES
    {
      type: "circle",
      size: 320,
      top: "10%",
      left: "5%",
      delay: "0s",
      duration: "24s",
      speed: 0.08,
    },
    {
      type: "circle",
      size: 180,
      top: "70%",
      left: "78%",
      delay: "2s",
      duration: "18s",
      speed: 0.05,
    },

    // ROUNDED SQUARES
    {
      type: "square",
      size: 340,
      top: "15%",
      left: "20%",
      delay: "0s",
      duration: "26s",
      speed: 0.12,
    },
    {
      type: "square",
      size: 220,
      top: "60%",
      left: "65%",
      delay: "3s",
      duration: "20s",
      speed: 0.09,
    },
    {
      type: "square",
      size: 120,
      top: "40%",
      left: "45%",
      delay: "1s",
      duration: "16s",
      speed: 0.07,
    },
    {
      type: "square",
      size: 70,
      top: "80%",
      left: "15%",
      delay: "4s",
      duration: "14s",
      speed: 0.04,
    },

    // RINGS
    {
      type: "ring",
      size: 200,
      top: "5%",
      left: "60%",
      delay: "1s",
      duration: "30s",
      speed: 0.06,
    },
    {
      type: "ring",
      size: 120,
      top: "65%",
      left: "25%",
      delay: "2s",
      duration: "24s",
      speed: 0.05,
    },

    // DIAMONDS
    {
      type: "diamond",
      size: 90,
      top: "25%",
      left: "80%",
      delay: "2s",
      duration: "20s",
      speed: 0.1,
    },
    {
      type: "diamond",
      size: 50,
      top: "75%",
      left: "40%",
      delay: "3s",
      duration: "16s",
      speed: 0.07,
    },

    // DOTS
    {
      type: "dot",
      size: 8,
      top: "20%",
      left: "35%",
      delay: "0s",
      duration: "10s",
      speed: 0.03,
    },
    {
      type: "dot",
      size: 5,
      top: "50%",
      left: "70%",
      delay: "2s",
      duration: "12s",
      speed: 0.02,
    },
    {
      type: "dot",
      size: 6,
      top: "85%",
      left: "55%",
      delay: "1s",
      duration: "14s",
      speed: 0.04,
    },

    // LINES
    {
      type: "line",
      size: 120,
      top: "30%",
      left: "55%",
      delay: "0s",
      duration: "20s",
      speed: 0.06,
    },
    {
      type: "line",
      size: 80,
      top: "70%",
      left: "25%",
      delay: "2s",
      duration: "18s",
      speed: 0.05,
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {shapes.map((shape, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: shape.top,
            left: shape.left,
            transform: `translateY(${scrollY * shape.speed}px)`,
            animationName: "float",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: shape.delay,
            animationDuration: shape.duration,
          }}
        >
          {/* CIRCLE */}
          {shape.type === "circle" && (
            <span
              style={{
                display: "block",
                width: shape.size,
                height: shape.size,
                borderRadius: "9999px",
                background:
                  "radial-gradient(circle, rgba(var(--primary),0.06) 0%, transparent 70%)",
                border: "1px solid rgba(var(--primary),0.05)",
                filter: "blur(2px)",
              }}
            />
          )}

          {/* ROUNDED SQUARE */}
          {shape.type === "square" && (
            <span
              style={{
                display: "block",
                width: shape.size,
                height: shape.size,
                borderRadius: "32px",
                background:
                  "linear-gradient(135deg, rgba(var(--primary),0.05), rgba(var(--primary),0.01))",
                border: "1px solid rgba(var(--primary),0.08)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 40px rgba(var(--primary),0.03)",
                transform: `rotate(${i * 8}deg)`,
              }}
            />
          )}

          {/* RING */}
          {shape.type === "ring" && (
            <span
              style={{
                display: "block",
                width: shape.size,
                height: shape.size,
                borderRadius: "9999px",
                border: "1px solid rgba(var(--primary),0.08)",
              }}
            />
          )}

          {/* DIAMOND */}
          {shape.type === "diamond" && (
            <span
              style={{
                display: "block",
                width: shape.size,
                height: shape.size,
                border: "1px solid rgba(var(--primary),0.1)",
                transform: "rotate(45deg)",
              }}
            />
          )}

          {/* DOT */}
          {shape.type === "dot" && (
            <span
              style={{
                display: "block",
                width: shape.size,
                height: shape.size,
                borderRadius: "9999px",
                background: "rgba(var(--primary),0.35)",
                boxShadow: "0 0 12px rgba(var(--primary),0.4)",
              }}
            />
          )}

          {/* LINE */}
          {shape.type === "line" && (
            <span
              style={{
                display: "block",
                width: shape.size,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(var(--primary),0.2), transparent)",
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
};

export default AnimatedBackground;