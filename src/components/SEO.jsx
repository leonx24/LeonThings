import { Helmet } from "react-helmet"

const defaults = {
  siteName: "Leon — Creative Developer",
  siteUrl: "https://leonthings.com",
  description: "Creative developer building modern web experiences and scalable game systems. Specializing in React, Python, and Roblox development.",
  ogImage: "https://leonthings.com/og-image.png",
}

export default function SEO({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
}) {
  const pageTitle = title
    ? `${title} — Leon`
    : defaults.siteName

  const pageDescription = description || defaults.description
  const pageUrl = `${defaults.siteUrl}${path}`
  const pageImage = ogImage || defaults.ogImage

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={defaults.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* No Index */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  )
}
