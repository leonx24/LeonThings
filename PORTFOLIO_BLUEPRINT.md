# 🌊 HARBOR — UI Overhaul Blueprint (Existing Repo + Graphify)

Dokumen ini adalah panduan teknis lengkap untuk **merombak tampilan (UI/UX & WebGL)** pada repository portofolio yang **sudah ada** menjadi konsep **HARBOR** (*Surface-to-Depths Cross-Section*), dengan memanfaatkan **Graphify** (`graphify-out/`) yang sudah terpasang di dalam project sebagai peta arsitektur bagi AI Coding Assistant.

---

## 1. Strategi Refactoring: Graphify-First Protocol

Karena project portofolio sudah berjalan dan sudah memiliki **Graphify**, kita **tidak membuat ulang repo dari nol**. Fokus utama adalah **memisahkan (decouple) data & business logic lama dari layer tampilan (UI)**, lalu memasang engine visual HARBOR di atasnya.

### A. Alur Kerja Wajib Sebelum Menyentuh Kode
1. **Sinkronkan Knowledge Graph Terbaru:**
   Pastikan `graphify-out/graph.json` dan `graphify-out/GRAPH_REPORT.md` mencerminkan kondisi kode terkini sebelum refactoring dimulai:
   ```bash
   graphify update .
   ```
2. **Pemetaan Node via Graphify (Blast Radius Check):**
   Gunakan Graphify (via CLI atau MCP tool `mcp__graphify__*`) untuk mengidentifikasi:
   * **Data & State Nodes (PERTAHANKAN):** File berisi daftar *project*, *experience*, *skills*, konfigurasi *contact form*, dan *routing/API*.
   * **Presentation & Styling Nodes (GANTI):** Komponen *navbar*, *hero section*, *project cards*, CSS/Tailwind lama, dan animasi lama.
3. **Adapter Pattern untuk Data Lama:**
   Jangan ubah struktur data project lama jika sudah terhubung ke CMS/JSON/API. Buat file adapter ringan (`src/ui/projectAdapter.ts`) untuk memetakan data lama ke format UI HARBOR (`id`, `index`, `title`, `techStack`, `summary`, `liveUrl`, `repoUrl`).
4. **Update Graph Setelah Migrasi:**
   Setelah modul WebGL dan UI baru selesai dipasang, jalankan kembali `graphify update .` agar AI selalu memiliki peta dependensi terbaru.

---

## 2. Audit Dependency & Instalasi Incremental

Jangan jalankan `npm create vite`. Cukup periksa `package.json` yang sudah ada di root project, lalu install paket yang belum tersedia:

### A. Paket yang Dibutuhkan untuk Konsep HARBOR
* **`three` & `@types/three`**: Engine WebGL untuk susunan layer 2.5D/3D, `FogExp2`, dan *custom shaders*.
* **`gsap`**: Mengikat progres scroll (`ScrollTrigger`) ke `camera.position.y`, paralaks layer, dan transisi warna latar/kabut.
* **`lenis`**: *Smooth inertial scrolling* agar sensasi menyelam dari permukaan ke dasar laut terasa halus.
* **`lucide` (atau `lucide-react` jika berbasis React)**: Ikon minimalis untuk *Floating Pill Dock* dan *Case Study Drawer*.
* **`vite-plugin-glsl`**: Untuk mengimpor file shader `.vert` dan `.frag` (jika project menggunakan Vite).

### B. Perintah Instalasi (Jalankan yang Belum Ada)
```bash
# 1. Install runtime dependencies (aman dijalankan meski sebagian sudah terpasang)
npm install three gsap lenis lucide

# 2. Install dev dependencies untuk TypeScript & GLSL shader
npm install -D @types/three vite-plugin-glsl
```

*(Catatan: Jika project lama kamu menggunakan **React / Next.js / Svelte**, kamu tetap bisa memakai Vanilla Three.js di dalam satu komponen `<HarborCanvas />` terisolasi agar ringan dan mudah dibersihkan saat unmount, tanpa perlu install wrapper tambahan seperti R3F).*

### C. Konfigurasi `vite.config.ts` (Tambahkan Plugin GLSL)
Pertahankan konfigurasi Vite yang sudah ada, cukup tambahkan `glsl()` di array `plugins`:
```ts
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  // Pertahankan plugin lama (misal react(), tailwindcss(), dll.) lalu tambahkan glsl()
  plugins: [glsl()],
});
```

---

## 3. Visual Direction & Design Tokens (HARBOR)

### A. Konsep Irisan Dua Dunia (*Surface-to-Depths Cross-Section*)
* **Zona Atas ($Y > 0$):** Langit senja keemasan ke biru indigo, dermaga kayu, dan mercusuar batu dengan cahaya hangat di pucuknya.
* **Garis Batas ($Y = 0$):** Permukaan air laut bergelombang lembut (*animated waterline shader*) yang membelah layar secara horizontal.
* **Zona Bawah ($Y < 0$):** Kedalaman laut biru-toska dengan berkas cahaya matahari (*god rays*), tanaman laut, reruntuhan lengkungan batu kuno, dan jangkar tua di dasar pasir.

### B. Palet Warna & Tipografi
Tambahkan variabel CSS berikut ke stylesheet utama project kamu:
```css
:root {
  /* Sky & Above Water */
  --harbor-sky-top: #1e315c;
  --harbor-sky-horizon: #c59b82;
  --harbor-lantern-glow: #ffd27d;

  /* Waterline & Underwater */
  --harbor-water-surface: #4fa3b8;
  --harbor-water-mid: #164e6b;
  --harbor-water-abyss: #091d2c;
  --harbor-caustics-ray: #7ee8fa;

  /* Typography & Glass UI */
  --harbor-text-primary: #f4efe6;
  --harbor-text-secondary: #b8c7d4;
  --harbor-glass-bg: rgba(10, 25, 41, 0.58);
  --harbor-glass-border: rgba(244, 239, 230, 0.18);

  /* Fonts */
  --font-editorial: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-ui: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
}
```

---

## 4. Struktur Modul Baru (Non-Destruktif)

Tambahkan modul HARBOR dalam folder terpisah di dalam `src/` agar tidak bentrok dengan folder data/utils lama:

```text
src/
├── (folder data / services / hooks lama tetap dipertahankan)
├── harbor/                         # Modul UI & WebGL baru yang terisolasi
│   ├── webgl/
│   │   ├── WebGLApp.ts             # Core renderer, camera, resize, RAF loop, dispose()
│   │   ├── SceneBuilder.ts         # Susunan layer 2.5D di sumbu X, Y, Z & FogExp2
│   │   ├── WaterlineMesh.ts        # Plane pemisah permukaan air (Y = 0)
│   │   └── CausticsEffect.ts       # God-rays & partikel gelembung laut (THREE.Points)
│   ├── shaders/
│   │   ├── waterline.vert          # Vertex shader gelombang permukaan
│   │   ├── waterline.frag          # Fragment shader garis air & meniscus glow
│   │   └── godrays.frag            # Fragment shader berkas cahaya bawah air
│   ├── scroll/
│   │   └── ScrollChoreographer.ts  # Sinkronisasi Lenis + GSAP ScrollTrigger
│   └── ui/
│       ├── projectAdapter.ts       # Penghubung data project lama ke UI HARBOR
│       ├── NavigationDock.ts       # Floating pill dock di bawah layar
│       └── ProjectDrawer.ts        # Slide-over panel detail case study
└── public/
    └── assets/harbor/              # Aset gambar 2.5D (.webp ber-alpha)
        ├── sky-sunset.webp
        ├── pier-lighthouse.webp
        ├── underwater-ruins.webp
        └── foreground-anchor.webp
```

---

## 5. Arsitektur 2.5D/3D Cross-Section & Koordinat

### A. Peta Posisi Vertikal (`Sumbu Y`)
* **$Y = +6.0$ s/d $+1.0$:** Langit senja, judul besar portofolio, dan tombol CTA *Start the journey*.
* **$Y = +0.5$ s/d $0.0$:** Dermaga kayu, mercusuar batu, serta **Project 01** di ruang langit/horizon.
* **$Y = 0.0$:** **Waterline Mesh** (garis permukaan air).
* **$Y = -1.5$ s/d $-5.5$:** Reruntuhan lengkungan batu bawah air, *god rays*, tanaman laut, serta **Project 02** (dan project berikutnya secara zig-zag).
* **$Y = -6.0$ s/d $-9.0$:** Dasar pasir laut, jangkar kapal tua, dan bagian **Contact / Footer**.

### B. Susunan Kedalaman Paralaks (`Sumbu Z`)
| Layer | Posisi $Z$ | Multiplier Paralaks | Keterangan Visual |
| :--- | :---: | :---: | :--- |
| **Background Sky & Deep Gradient** | $Z = -20$ | `0.1x` | Gradien warna langit yang berinterpolasi ke biru laut dalam via `FogExp2`. |
| **Far Horizon / Distant Cliffs** | $Z = -12$ | `0.3x` | Siluet tebing jauh & kabut tipis. |
| **Hero Architecture** | $Z = -6$ | `0.6x` | Mercusuar di atas ($Y > 0$) dan reruntuhan lengkungan batu di bawah ($Y < 0$). |
| **Waterline Cross-Section Plane** | $Z = 0$ | `1.0x` | Garis gelombang air horizontal dengan kilau tepi permukaan (*meniscus glow*). |
| **Foreground Elements** | $Z = +3$ | `1.3x` | Jangkar kapal tua di kanan bawah & siluet rumput laut di tepi bingkai layar. |
| **Perspective Camera** | $Z = +12$ | — | `FOV = 45` (Desktop) dan `FOV = 58` (Mobile). |

---

## 6. Spesifikasi Custom GLSL Shaders

### A. Waterline Cross-Section Shader (`src/harbor/shaders/waterline.frag`)
```glsl
uniform float uTime;
uniform vec3 uSurfaceColor;
uniform vec3 uDeepColor;
varying vec2 vUv;

void main() {
  float wave1 = sin(vUv.x * 10.0 + uTime * 1.4) * 0.012;
  float wave2 = cos(vUv.x * 22.0 - uTime * 0.9) * 0.006;
  float surfaceLine = 0.85 + wave1 + wave2;

  if (vUv.y > surfaceLine) {
    discard;
  }

  float distToSurface = surfaceLine - vUv.y;
  float meniscus = smoothstep(0.035, 0.0, distToSurface);

  vec3 waterGrad = mix(uDeepColor, uSurfaceColor, smoothstep(0.0, 0.85, vUv.y));
  vec3 finalColor = mix(waterGrad, vec3(0.85, 0.95, 1.0), meniscus * 0.65);

  float bottomFade = smoothstep(0.0, 0.25, vUv.y);
  gl_FragColor = vec4(finalColor, 0.88 * bottomFade + meniscus * 0.12);
}
```

### B. Underwater God-Rays Shader (`src/harbor/shaders/godrays.frag`)
```glsl
uniform float uTime;
uniform vec3 uRayColor;
varying vec2 vUv;

void main() {
  float diagonal = vUv.x * 1.4 + vUv.y * 0.35;
  
  float rays = sin(diagonal * 18.0 + uTime * 0.5) * 0.5 + 0.5;
  rays *= sin(diagonal * 31.0 - uTime * 0.3) * 0.5 + 0.5;
  rays = pow(rays, 2.5);

  float horizontalMask = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
  float verticalFade = smoothstep(0.0, 0.95, vUv.y);

  float alpha = rays * horizontalMask * verticalFade * 0.28;
  gl_FragColor = vec4(uRayColor, alpha);
}
```

---

## 7. UI/UX & Engineering Rules (`.cursorrules` / `CLAUDE.md`)

Salin aturan di bawah ini ke file `.cursorrules` atau `CLAUDE.md` di root project agar AI coding assistant mematuhi Graphify dan standar performa:

> ### AI AGENT & DEVELOPER RULES (HARBOR UI OVERHAUL)
> 1. **Query Graphify First:** Sebelum memodifikasi file lama, wajib periksa `graphify-out/GRAPH_REPORT.md` atau jalankan query ke `graphify-out/graph.json` untuk mengetahui dependensi komponen UI lama dan memastikan data portofolio / API / form kontak tidak ikut terhapus.
> 2. **Borderless Editorial UI:** Hilangkan kotak *card* berlatar solid pada daftar project. Tampilkan judul serif, nomor urut (`01 / ...`), dan tag teknologi langsung di ruang negatif pemandangan dengan `text-shadow: 0 2px 20px rgba(6, 18, 30, 0.65)`.
> 3. **Responsive Framing:**
>    * **Desktop ($\ge 768\text{px}$):** Tata letak zig-zag bergantian (kiri/kanan) mengikuti ruang kosong pemandangan.
>    * **Mobile ($< 768\text{px}$):** Geser kamera ke kanan (`camera.position.x = 1.2`) agar mercusuar dan reruntuhan berada di sisi kanan layar, menyisakan ruang gelap di sisi kiri untuk keterbacaan teks putih.
> 4. **Floating Pill Dock & Slide-Over Drawer:** Navigasi utama menggunakan kapsul melayang (`border-radius: 9999px`, `backdrop-filter: blur(12px)`) di bagian bawah layar (`bottom: 24px`). Detail studi kasus project dibuka melalui panel *drawer* geser tanpa memuat ulang halaman.
> 5. **60 FPS Mobile Performance Budget:**
>    * Batasi `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
>    * Hindari `EffectComposer` post-processing berat; gunakan tekstur `.webp` maksimal `2048px` dan `AdditiveBlending` untuk efek cahaya.
>    * Wajib panggil `.dispose()` pada `Geometry`, `Material`, dan `Texture` saat komponen di-unmount.
> 6. **Semantic HTML Layer:** Seluruh teks, tombol, dan link tetap berada di DOM HTML di atas `<canvas>` (`pointer-events: none` pada container canvas, `pointer-events: auto` pada elemen interaktif) demi SEO dan aksesibilitas.

---

## 8. Master Prompts (Khusus Refactoring dengan Graphify)

Gunakan prompt berikut secara berurutan di AI Coding Assistant kamu:

### Prompt 1: Audit Struktur Lama via Graphify
> *"Baca `graphify-out/GRAPH_REPORT.md` dan query `graphify-out/graph.json`. Petakan semua file di repository ini menjadi dua kategori: (1) File Data, State, Routing, dan Logic yang harus dipertahankan, dan (2) File UI/Styling lama yang akan digantikan oleh arsitektur baru di `PORTFOLIO_BLUEPRINT.md`. Jangan ubah kode dulu—berikan rencana migrasi dan daftar file yang akan disentuh."*

### Prompt 2: Generate Aset Gambar Berlapis HARBOR
> *"2.5D stylized digital illustration for an interactive WebGL portfolio, cross-section aesthetic, twilight indigo and warm golden sunset sky, solitary stone lighthouse on a rustic wooden pier on the right, clean negative space on the left, painterly brushwork with crisp silhouettes, calm reflective ocean surface, high contrast lighting, no text, no UI elements, 4k resolution --ar 16:9"*
> *(Ekspor menjadi 4 file `.webp` ber-alpha di `public/assets/harbor/` dengan tepi transisi yang di-feather lembut).*

### Prompt 3: Implementasi WebGL & Shader HARBOR
> *"Mengacu pada `PORTFOLIO_BLUEPRINT.md` Section 4–6, buatkan folder `src/harbor/` berisi `WebGLApp.ts`, `SceneBuilder.ts`, `WaterlineMesh.ts`, `CausticsEffect.ts`, dan `ScrollChoreographer.ts` (menggunakan Lenis + GSAP ScrollTrigger). Pastikan setiap resource WebGL memiliki method `dispose()` dan mendukung fallback CSS gradient jika WebGL tidak aktif."*

### Prompt 4: Sambungkan Data Lama ke UI HARBOR & Update Graph
> *"Buat `src/harbor/ui/projectAdapter.ts` untuk menghubungkan data project yang sudah ada di repo ini ke tampilan baru HARBOR (Borderless Zig-Zag Editorial, Floating Pill Dock, dan Slide-Over Project Drawer) tanpa menghilangkan fitur kontak/social link lama. Setelah selesai, jalankan `graphify update .` untuk memperbarui knowledge graph."*