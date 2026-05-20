import { Helmet } from "react-helmet";

const SEO = () => {
  return (
    <Helmet>
      {/* TITLE */}
      <title>
        Leon — Frontend Developer
      </title>

      {/* DESCRIPTION */}
      <meta
        name="description"
        content="
          Modern frontend developer portfolio
          built with React, Tailwind CSS,
          and Framer Motion.
        "
      />

      {/* KEYWORDS */}
      <meta
        name="keywords"
        content="
          frontend developer,
          react developer,
          tailwind css,
          portfolio website,
          web developer
        "
      />

      {/* AUTHOR */}
      <meta
        name="author"
        content="Leon"
      />

      {/* THEME */}
      <meta
        name="theme-color"
        content="#09090B"
      />

      {/* OPEN GRAPH */}
      <meta
        property="og:title"
        content="Leon — Frontend Developer"
      />

      <meta
        property="og:description"
        content="
          Modern and elegant developer portfolio
          built with React and Tailwind CSS.
        "
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:image"
        content="/public/og-image.png"
      />

      {/* TWITTER */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Leon — Frontend Developer"
      />

      <meta
        name="twitter:description"
        content="
          Modern frontend developer portfolio.
        "
      />

      <meta
        name="twitter:image"
        content="/public/og-image.png"
      />
    </Helmet>
  );
};

export default SEO;