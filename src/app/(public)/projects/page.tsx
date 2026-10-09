import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { Alert } from "@/components/ui/alert";
import { ProjectCard } from "@/features/projects/components/project-card";
import { getProjects } from "@/features/projects/services/project-repository";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMetadata({
    title: t.projects.metaTitle,
    description: t.projects.metaDescription,
    path: "/projects",
    locale,
  });
}

export default async function ProjectsPage() {
  const { locale, t } = await getI18n();
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        subtitle={t.projects.subtitle}
        breadcrumbLabel={t.common.breadcrumb}
        breadcrumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.projects }]}
      />
      <div className="container-site py-10 lg:py-14">
        <Alert className="mb-8">{t.projects.demoNote}</Alert>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 0.08} className="h-full">
              <ProjectCard project={project} locale={locale} t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
