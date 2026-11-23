import SEO from "../components/SEO"
import HarborExperience from "../harbor/ui/HarborExperience"

export default function Home() {
  return (
    <>
      <SEO
        title={null}
        description="Creative developer building modern web experiences, interactive WebGL worlds, and scalable game systems."
        path="/"
      />
      <HarborExperience />
    </>
  )
}
