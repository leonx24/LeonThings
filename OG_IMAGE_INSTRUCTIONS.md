# OG Image Setup Instructions

## 📸 How to Create Your OG Image

You have 2 options:

### **Option 1: Screenshot Method (Easy, 2 minutes)**

1. Open `og-image-generator.html` in your browser
2. The page shows a 1200x630px card with your portfolio design
3. Take a screenshot of JUST the card (not the whole page)
   - **Chrome/Edge:** Right-click the card → Inspect → Right-click the `.og-card` element → Capture node screenshot
   - **Firefox:** Use Firefox Screenshot tool (Shift+Cmd+S or Shift+Ctrl+S)
   - **Manual:** Use any screenshot tool and crop to exactly the card
4. Save as `og-image.png`
5. Place in `public/og-image.png`
6. Done! The `index.html` already references it.

### **Option 2: Online Generator (Advanced, 5 minutes)**

Use https://og-playground.vercel.app/ to generate programmatically:

1. Go to the playground
2. Paste this code:

```jsx
export default function OGImage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0a0a0a',
        color: '#fff',
        padding: '80px',
        fontFamily: 'system-ui',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.32em', color: 'rgba(255,255,255,0.35)' }}>
          PORTFOLIO
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '120px', lineHeight: 0.95, letterSpacing: '-0.01em', margin: 0 }}>
          Leon
        </h1>
        <h2 style={{ fontSize: '120px', lineHeight: 0.95, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Creative Developer
        </h2>
        <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginTop: '40px', maxWidth: '600px' }}>
          Building modern web experiences and scalable game systems.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)' }}>
          AVAILABLE FOR PROJECTS
        </div>
      </div>
    </div>
  )
}
```

3. Click "Generate"
4. Download as `og-image.png`
5. Place in `public/og-image.png`

## ✅ Verification

After placing the image:

1. Build: `npm run build`
2. Preview: `npm run preview`
3. Check: View page source and confirm `/og-image.png` exists
4. Test: Share your Vercel URL on Discord/Slack and see the preview

## 🌐 Update Domain

In `index.html`, replace `https://leonthings.com/` with your actual Vercel domain:

```html
<meta property="og:image" content="https://YOUR-SITE.vercel.app/og-image.png" />
<meta property="twitter:image" content="https://YOUR-SITE.vercel.app/og-image.png" />
```

## 📏 Specs

- **Size:** 1200x630px (Facebook/Twitter recommended)
- **Format:** PNG or JPG
- **Max file size:** < 1MB
- **Aspect ratio:** 1.91:1

## 🎨 Customization

Edit `og-image-generator.html` to change:
- Your name
- Title/tagline
- Description
- Colors
- Layout

Then regenerate the screenshot!
