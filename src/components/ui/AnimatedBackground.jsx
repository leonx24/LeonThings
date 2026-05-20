const particles = [
  { left: "12%", top: "18%", size: 2, duration: 24, delay: 0 },
  { left: "22%", top: "72%", size: 2, duration: 28, delay: 2 },
  { left: "38%", top: "34%", size: 2, duration: 30, delay: 4 },
  { left: "58%", top: "82%", size: 2, duration: 26, delay: 1 },
  { left: "74%", top: "24%", size: 2, duration: 32, delay: 3 },
  { left: "84%", top: "58%", size: 2, duration: 34, delay: 5 },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#09090B]">
      
      {/* Base Ambient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top, rgba(34,211,238,0.06), transparent 35%),
            radial-gradient(circle at bottom right, rgba(34,211,238,0.04), transparent 40%)
          `,
        }}
      />

      {/* Top Light */}
      <div
        className="
          absolute
          top-[-5%]
          left-1/2
          -translate-x-1/2
          w-500px
          h-220px
          opacity-20
        "
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Left Glow */}
      <div
        className="
          absolute
          top-[10%]
          left-[-5%]
          w-320px
          h-320px
          rounded-full
          bg-cyan-500/10
          blur-[70px]
          animate-floatSlow
        "
      />

      {/* Right Glow */}
      <div
        className="
          absolute
          bottom-[-5%]
          right-[-5%]
          w-360px
          h-360px
          rounded-full
          bg-cyan-400/10
          blur-[80px]
          animate-floatSlowReverse
        "
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
              animation: `
                floatParticle ${particle.duration}s ease-in-out infinite
              `,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "90px 90px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(9,9,11,0.5) 75%, #09090B 100%)",
        }}
      />
    </div>
  );
}