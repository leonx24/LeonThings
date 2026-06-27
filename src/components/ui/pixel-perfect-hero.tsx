"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

/* -----------------------------------------------------------------------------
 * VECTOR BRAND LOGO COMPONENTS
 * Custom monochrome vector logos matching the project's actual tech stack
 * -------------------------------------------------------------------------- */

const BRAND_LOGOS = [
  // React
  () => (
    <div className="flex items-center justify-start font-mono text-[10px] uppercase tracking-wider gap-2.5 text-white/35 hover:text-white transition-opacity duration-300">
      <svg className="h-[18px] sm:h-[22px] w-auto fill-cyan-400/80" viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
      React
    </div>
  ),
  // Python
  () => (
    <div className="flex items-center justify-start font-mono text-[10px] uppercase tracking-wider gap-2.5 text-white/35 hover:text-white transition-opacity duration-300">
      <svg className="h-[18px] sm:h-[22px] w-auto fill-current" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
        <path d="M55 0C24.6 0 24.6 13.2 24.6 13.2L24.7 26.8H55.4V31.1H12.3C12.3 31.1 0 31.1 0 55.7C0 80.3 10.8 80 10.8 80H22.5V63.6C22.5 40.5 41 40 41 40H69V26.8C69 26.8 69.5 0 55 0ZM85.4 30C85.4 30 73.7 30 73.7 46.4V62.8H43V67.1H86.2C86.2 67.1 98.5 67.1 98.5 42.5C98.5 17.9 87.7 18.2 87.7 18.2H76V34.6C76 57.7 57.5 58.2 57.5 58.2H29.5V71.4C29.5 71.4 29 98.2 43.5 98.2C58 98.2 58 85 58 85V71.4H27.3L27.2 67.1H85.4V30ZM42.6 11.4C45.3 11.4 47.4 13.5 47.4 16.1C47.4 18.7 45.3 20.8 42.6 20.8C39.9 20.8 37.8 18.7 37.8 16.1C37.8 13.5 39.9 11.4 42.6 11.4ZM57.4 86.8C54.7 86.8 52.6 84.7 52.6 82.1C52.6 79.5 54.7 77.4 57.4 77.4C60.1 77.4 62.2 79.5 62.2 82.1C62.2 84.7 60.1 86.8 57.4 86.8Z" />
      </svg>
      Python
    </div>
  ),
  // Tailwind CSS
  () => (
    <div className="flex items-center justify-start font-mono text-[10px] uppercase tracking-wider gap-2.5 text-white/35 hover:text-white transition-opacity duration-300">
      <svg
        className="h-[18px] sm:h-[22px] w-auto select-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 54 33"
      >
        <path
          className="fill-cyan-500"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.004 7.263 26.472 8.754 28.097 10.403C30.744 13.09 33.808 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.496 8.937 41.028 7.446 39.403 5.797C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.504 23.464 12.972 24.954 14.597 26.603C17.244 29.29 20.308 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.996 25.137 27.528 23.646 25.903 21.997C23.256 19.31 20.192 16.2 13.5 16.2Z"
        />
      </svg>
      Tailwind CSS
    </div>
  ),
  // Framer Motion
  () => (
    <div className="flex items-center justify-start font-mono text-[10px] uppercase tracking-wider gap-2.5 text-white/35 hover:text-white transition-opacity duration-300">
      <svg
        viewBox="0 0 14 21"
        role="presentation"
        className="h-[18px] md:h-[22px] fill-current"
      >
        <path d="M0 0h14v7H7zm0 7h7l7 7H7v7l-7-7z" fill="currentColor"></path>
      </svg>
      Motion
    </div>
  ),
  // Vercel
  () => (
    <div className="flex items-center justify-start font-mono text-[10px] uppercase tracking-wider gap-2.5 text-white/35 hover:text-white transition-opacity duration-300">
      <svg className="h-[14px] sm:h-[18px] w-auto fill-current" viewBox="0 0 76 65" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      Vercel
    </div>
  ),
  // Roblox
  () => (
    <div className="flex items-center justify-start font-mono text-[10px] uppercase tracking-wider gap-2.5 text-white/35 hover:text-white transition-opacity duration-300">
      <svg className="h-[16px] sm:h-[20px] w-auto fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.38 0L0 20.08L18.62 24L24 3.92L5.38 0ZM9.68 15.05L7.75 7.91L14.89 5.98L16.82 13.12L9.68 15.05Z" />
      </svg>
      Roblox/Luau
    </div>
  ),
];

/* -----------------------------------------------------------------------------
 * CANVAS STAGGERED PHYSICS ENGINE
 * Calibrated outward expansion ripple: extremely smooth and slightly relaxed 
 * to feel cohesive, satisfyingly responsive, and visually distinct.
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number;
  y: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  draw: () => void;
  appear: () => void;
  disappear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const p: Pixel = {
    x, y, color, ctx,
    speed: rand(0.08, 0.4) * baseSpeed,
    size: 0,
    sizeStep: rand(0.12, 0.28),
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
        return;
      }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

type PixelCanvasProps = {
  colors: string[];
  gap?: number;
  speed?: number;
};

function PixelCanvas({ colors, gap = 5, speed = 30 }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(performance.now());
  const reducedMotionRef = useRef(false);
  const isIntersectingRef = useRef(true);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || colors.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.65;
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      if (!isIntersectingRef.current) return;
      animationRef.current = requestAnimationFrame(loop);

      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();

    const resizeObserver = new ResizeObserver(() => init());
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          animate("appear");
        } else {
          cancelAnimationFrame(animationRef.current);
        }
      },
      { threshold: 0.05 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);

    animate("appear");

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}


/* -----------------------------------------------------------------------------
 * HERO COMPONENT
 * -------------------------------------------------------------------------- */

interface PixelHeroProps {
  word1?: string;
  word2?: string;
  description?: string;
  primaryCta?: string;
  primaryCtaMobile?: string;
  secondaryCta?: string;
  secondaryCtaMobile?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  githubUrl?: string;
}

export function PixelHero({
  word1 = "Creative",
  word2 = "Developer.",
  description = "I develop responsive React web applications, write custom backend integrations, and engineer game systems in Roblox. Focused on making things that look clean and run fast.",
  primaryCta = "Explore Design",
  primaryCtaMobile = "Explore",
  secondaryCta = "View GitHub",
  secondaryCtaMobile = "GitHub",
  onPrimaryClick,
  onSecondaryClick,
  githubUrl = "https://github.com/leonx24",
}: PixelHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeColors, setThemeColors] = useState<string[]>([]);

  useEffect(() => {
    // Generate subtle luxury-minimalist overlay colors for pixels
    setThemeColors([
      "rgba(255, 255, 255, 0.03)", 
      "rgba(255, 255, 255, 0.05)", 
      "rgba(255, 255, 255, 0.08)", 
      "rgba(255, 255, 255, 0.12)", 
      "rgba(255, 255, 255, 0.18)"
    ]);

    const loadTimer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <div id="hero" className="relative w-full min-h-[100dvh] bg-[#0a0a0a] flex flex-col justify-between md:justify-center md:gap-6 py-8 md:py-0 px-2 sm:px-6 overflow-hidden select-none isolate">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .tahoe-glass-text {
            color: transparent;
            background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.45) 25%, rgba(255, 255, 255, 0.15) 45%, rgba(255, 255, 255, 0.95) 55%, rgba(255, 255, 255, 0.25) 75%, rgba(255, 255, 255, 1) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.18);
            filter: drop-shadow(0 15px 35px rgba(0,0,0,0.6)) drop-shadow(0 5px 10px rgba(0,0,0,0.4));
            animation: shimmer 8s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: 0% center; }
        }
      `}</style>

      {/* Permanent canvas background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {themeColors.length > 0 && <PixelCanvas colors={themeColors} gap={16} speed={30} />}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)] pointer-events-none opacity-80" />
      </div>

      {/* Top Container: Tahoe Glass Header */}
      <div className="flex flex-col items-center justify-center text-center order-1 md:order-1 mt-28 sm:mt-0 pointer-events-none w-full">
        <h1 className="tahoe-glass-text flex flex-row items-center justify-center gap-1.5 sm:gap-4 lg:gap-6 px-1 w-full flex-wrap text-[2.8rem] xs:text-[3.2rem] sm:text-6xl md:text-8xl lg:text-9xl leading-none">
          <span className="font-serif italic font-medium">{word1}</span>
          <span className="font-sans font-extrabold tracking-tighter">{word2}</span>
        </h1>
      </div>

      {/* Center Container: Description & Mobile Vector Marquee */}
      <div className="flex flex-col items-center justify-center text-center my-auto md:my-0 order-2 md:order-2 px-1 w-full pointer-events-none">
        <p className="text-[12px] sm:text-[13px] md:text-sm font-sans leading-[1.85] text-white/60 max-w-[95%] sm:max-w-md md:max-w-xl px-1">
          {description}
        </p>

        <div className="block md:hidden w-full mt-14 pointer-events-auto">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35 mb-5">
            Core Technology Stack
          </div>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="flex w-max gap-12 py-1 animate-marquee">
              <div className="flex gap-12 items-center">{BRAND_LOGOS.map((Logo, i) => <Logo key={i} />)}</div>
              <div className="flex gap-12 items-center" aria-hidden="true">{BRAND_LOGOS.map((Logo, i) => <Logo key={`c-${i}`} />)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Container: CTA Row */}
      <div
        className={cn("pointer-events-auto flex flex-row items-center justify-center gap-3 mt-4 md:mt-10 mb-4 md:mb-0 order-4 md:order-3 transition-all duration-1000 transform px-1", isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
        style={{ transitionDelay: "450ms" }}
      >
        <button 
          onClick={onPrimaryClick} 
          className="relative inline-flex h-10 md:h-12 items-center justify-center gap-1.5 md:gap-2 rounded-none border border-white px-4 md:px-8 font-mono text-[10px] uppercase tracking-[0.22em] text-black bg-white transition-all duration-300 hover:bg-transparent hover:text-white cursor-pointer"
        >
          <span className="inline md:hidden">{primaryCtaMobile}</span>
          <span className="hidden md:inline">{primaryCta}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={onSecondaryClick} 
          className="relative inline-flex h-10 md:h-12 items-center justify-center gap-1.5 md:gap-2 rounded-none border border-white/13 px-4 md:px-8 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 transition-all duration-300 hover:bg-white/5 hover:border-white/30 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span className="inline md:hidden">{secondaryCtaMobile}</span>
          <span className="hidden md:inline">{secondaryCta}</span>
        </a>
      </div>

      {/* Desktop-only Marquee Block */}
      <div
        className={cn("hidden md:flex absolute bottom-8 left-0 right-0 w-full z-10 pointer-events-auto flex-col items-center justify-center gap-4 transition-all duration-1000 transform order-3 md:order-4", isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35 select-none">
          Core Technology Stack
        </span>
        <div className="relative w-full max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <div className="flex w-max gap-16 py-3 animate-marquee">
            <div className="flex gap-16 items-center">{BRAND_LOGOS.map((Logo, i) => <Logo key={i} />)}</div>
            <div className="flex gap-16 items-center" aria-hidden="true">{BRAND_LOGOS.map((Logo, i) => <Logo key={`c-${i}`} />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
