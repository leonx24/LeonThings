// src/components/ui/CustomCursor.jsx

import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const [ripples, setRipples] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Mouse move desktop only
  useEffect(() => {
    if (isMobile) return;

    const move = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [isMobile]);

  // Ripple desktop + mobile
  useEffect(() => {
    const createRipple = (x, y) => {
      const id = Date.now();

      setRipples((prev) => [
        ...prev,
        {
          id,
          x,
          y,
        },
      ]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((r) => r.id !== id)
        );
      }, 700);
    };

    const clickEffect = (e) => {
      createRipple(e.clientX, e.clientY);
    };

    const touchEffect = (e) => {
      const touch = e.touches[0];

      createRipple(touch.clientX, touch.clientY);
    };

    window.addEventListener("click", clickEffect);
    window.addEventListener("touchstart", touchEffect);

    return () => {
      window.removeEventListener("click", clickEffect);
      window.removeEventListener("touchstart", touchEffect);
    };
  }, []);

  return (
    <>
      {/* DESKTOP ONLY */}
      {!isMobile && (
        <>
          {/* SPOTLIGHT */}
          <div
            className="fixed inset-0 pointer-events-none z-1"
            style={{
              background: `radial-gradient(
                350px at ${mouse.x}px ${mouse.y}px,
                rgba(var(--primary),0.10),
                transparent 80%
              )`,
            }}
          />

          {/* GLOW */}
          <div
            className="fixed top-0 left-0 z-[9998 pointer-events-none"
            style={{
              transform: `translate(${mouse.x - 75}px, ${mouse.y - 75}px)`,
            }}
          >
            <div
              className="w-150px h-150px rounded-full blur-3xl"
              style={{
                background: "rgba(var(--primary),0.10)",
              }}
            />
          </div>

          {/* CURSOR */}
          <div
            className="fixed top-0 left-0 z-9999 w-3 h-3 rounded-full pointer-events-none"
            style={{
              background: "rgb(var(--primary))",
              transform: `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`,
            }}
          />
        </>
      )}

      {/* RIPPLE */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;