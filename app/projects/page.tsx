import { Sprout } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { LocalizedHeading } from "@/components/localized-heading"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb label="projects" />

      <LocalizedHeading section="pages" titleKey="projectsTitle" subtitleKey="projectsSubtitle" icon={Sprout} />

      <ProjectsGrid />
    </main>
  )
}
