# LeonThings Portfolio

Personal portfolio website showcasing creative development work with a premium, minimalist aesthetic.

## Design Philosophy

**Theme: Clean · Dark · Expensive**

This portfolio embodies luxury minimalism through:
- **Ultra-refined typography** — Instrument Serif for elegance, Geist for clarity, DM Mono for precision
- **Monochromatic palette** — Pure blacks (#0a0a0a, #0f0f0f, #161616) with subtle white overlays
- **Breathing space** — Generous whitespace, restrained borders (white/[0.07]), minimal chrome
- **Subtle motion** — Framer Motion animations that feel effortless, not flashy
- **Premium details** — Hover states, micro-interactions, precise spacing

Think: Apple keynote slides, high-end fashion lookbooks, Swiss design principles.

## Tech Stack

- **React 19** with Vite 8
- **Tailwind CSS 4** for styling
- **Framer Motion 12** for animations
- **React Router DOM 7** for navigation
- **Lucide React** for icons

## Code Style

### Components
- Functional components with hooks only
- One component per file
- Clear, semantic naming
- Props destructured in parameters

### Styling
- Tailwind utility classes exclusively
- No custom CSS except global styles in `index.css`
- Responsive-first with `lg:` breakpoint (1024px)
- Clamp for fluid typography: `text-[clamp(min,preferred,max)]`
- Opacity for color variations: `text-white/60`, `border-white/[0.07]`

### Typography Scale
- **Labels**: `text-[10px]` or `text-[11px]` uppercase, `tracking-[0.2em]` or wider
- **Body**: `text-[12px]` to `text-[13px]`, `leading-[1.85]` to `leading-[1.95]`
- **Headings**: Use clamp — `text-[clamp(36px,4.5vw,72px)]`
- **Display**: `text-[clamp(60px,8.5vw,136px)]` with `leading-[0.92]` or tighter

### Spacing
- Use Tailwind's spacing scale
- Prefer `px-8 lg:px-16` for page margins
- Section padding: `py-25 lg:py-35` or `py-24`
- Generous gaps: `gap-16 lg:gap-25` for major layout elements

### Animations
- Use Framer Motion's `motion` components
- Subtle opacity + Y-axis transforms
- Duration: 0.7s–0.9s
- Stagger delays: 0.2s–0.4s increments
- Hover transitions: 300ms

### Borders & Dividers
- Standard border: `border-white/[0.07]`
- Hover borders: `border-white/13`
- Always use low opacity for "expensive" subtlety

## Project Structure

```
src/
├── pages/
│   ├── home.jsx              # Main landing page
│   └── ProjectDetail.jsx     # Individual project case study
├── components/
│   ├── navbar.jsx            # Global navigation
│   ├── hero.jsx              # Landing hero with large typography
│   ├── about.jsx             # About + skills grid
│   ├── work.jsx              # Project listing
│   ├── services.jsx          # Service offerings
│   ├── contact.jsx           # Contact form/info
│   ├── quote.jsx             # Testimonial or quote section
│   ├── footer.jsx            # Site footer
│   ├── gridLines.jsx         # Subtle background grid effect
│   ├── noise.jsx             # Texture overlay for depth
│   ├── reveal.jsx            # Scroll-triggered reveal wrapper
│   └── divider.jsx           # Minimal section divider
├── data/
│   ├── projects.js           # Portfolio projects array
│   └── services.js           # Services data
├── hooks/
│   ├── useReveal.jsx         # Intersection observer for reveals
│   └── useNavbar.jsx         # Navbar scroll behavior
└── routes/
    └── router.jsx            # Route definitions (unused; routing in App.jsx)
```

## Adding New Projects

Edit `src/data/projects.js`:

```js
{
  number: "03",                    // Sequential, zero-padded
  title: "Project Name",
  slug: "project-name",            // URL-friendly
  tags: ["Tech", "Stack"],         // 2-4 tags max
  year: "2026",
  overview: "One-paragraph summary of the project",
  challenge: "What problem needed solving",
  solution: "How you approached it",
  result: "Outcome and impact",
  gallery: [img1, img2, img3]     // Import images at top of file
}
```

**Image requirements:**
- Place in `src/assets/images/`
- Import at top: `import img from "../assets/images/name.png"`
- First image is hero image
- Gallery supports alternating left/right layout

## Adding Services

Edit `src/data/services.js`:

```js
{
  id: "04",                        // Sequential, zero-padded
  title: "Service\nName",          // \n for intentional line break
  desc: "Brief description of the service offering."
}
```

## Color Palette

```css
--color-bg:   #0a0a0a    /* Primary background */
--color-bg2:  #0f0f0f    /* Secondary surface */
--color-bg3:  #161616    /* Hover/active states */

/* Text colors via opacity */
text-white               /* 100% — headings, emphasis */
text-white/70            /* 70% — body text, descriptions */
text-white/60            /* 60% — secondary text, italics */
text-white/35            /* 35% — labels, meta, de-emphasized */

/* Borders */
border-white/[0.07]      /* 7% — standard dividers */
border-white/10          /* 10% — image borders */
border-white/13          /* 13% — tag borders */
```

## Key Design Patterns

### Section Headers
```jsx
<div className="flex items-center gap-3.5 mb-10 font-mono uppercase tracking-[0.32em] text-[10px] text-white/35">
  <span className="w-7 h-px bg-white/35" />
  Section Name
</div>
```

### Project Card Hover
- Subtle `hover:bg-white/1.5` for row backgrounds
- Translate on hover: `group-hover:translate-x-1`
- Arrow transitions: `group-hover:translate-x-2 group-hover:-translate-y-2`

### Reveal Animation
Wrap content blocks in `<Reveal>` or `<Reveal delay={0.15}>` for scroll-triggered fades.

### Responsive Typography
Always use `clamp()` for fluid scaling:
```
text-[clamp(minPx, preferredVw, maxPx)]
```

## Development

```bash
npm run dev      # Start dev server (default: http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## Deployment

Built for static hosting (Vercel, Netlify, Cloudflare Pages).

**Vercel** (recommended):
```bash
vercel
```

## Content Guidelines

### Tone
- Confident, not boastful
- Clear, not verbose
- Showcase work, not yourself

### Project Descriptions
- **Overview**: What it is, in one sentence
- **Challenge**: The core problem
- **Solution**: Your approach (keep focused)
- **Result**: Measurable outcome or impact

Avoid marketing speak. Use active voice. Be specific.

### Photography
- High contrast, crisp screenshots
- Consistent framing across projects
- Dark mode preferred for UI shots
- No watermarks or busy backgrounds

## Future Enhancements

Consider adding:
- [ ] Blog/writing section
- [ ] Case study pages with more depth
- [ ] Testimonials component
- [ ] Dark mode toggle (currently always dark)
- [ ] Analytics integration
- [ ] OG image generation for social sharing
- [ ] Smooth scroll library (Lenis)
- [ ] Custom cursor on desktop
- [ ] Page transitions between routes
- [ ] Loading states for images
- [ ] Contact form backend integration

## Notes

- `router.jsx` exists but is unused — routing is defined in `App.jsx` (consider removing one)
- Navbar uses scroll detection; test sticky behavior across pages
- Image optimization: consider WebP format, lazy loading for gallery images
- Accessibility: ensure sufficient color contrast for text-white/35 labels on small screens
