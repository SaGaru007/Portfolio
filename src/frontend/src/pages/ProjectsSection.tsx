import { Button } from "@/components/ui/button";
import { projects } from "@/data/portfolio-data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Project } from "@/types/portfolio";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, ExternalLink, Github } from "lucide-react";
import { useState } from "react";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useScrollAnimation<HTMLElement>({
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <article
      ref={ref}
      className="scroll-hidden group relative bg-card border border-border rounded-lg p-7 sm:p-8 flex flex-col gap-5 hover:border-primary/50 transition-colors duration-200"
      style={{ transitionDelay: `${index * 80}ms` }}
      data-ocid={`projects.item.${index + 1}`}
    >
      {/* Featured accent line */}
      {project.featured && (
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/70 rounded-t-lg" />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Year + badges row */}
          <div className="flex flex-nowrap items-center gap-2 mb-2 whitespace-nowrap">
            <span className="font-mono text-[10px] tracking-wider text-secondary shrink-0">
              {project.year}
            </span>
            {project.featured && (
              <span className="tag-pill shrink-0">Featured</span>
            )}
            {project.isAcademic && (
              <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-sm border border-secondary/40 text-secondary bg-secondary/10 shrink-0">
                <BookOpen size={9} aria-hidden="true" />
                Academic Project
              </span>
            )}
            {project.category && (
              <span className="font-mono text-[9px] tracking-wider uppercase text-secondary border border-border rounded-sm px-1.5 py-0.5 shrink-0">
                {project.category}
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-lg tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid={`projects.github_link.${index + 1}`}
            >
              <Github size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="font-body text-base font-normal not-italic text-muted-foreground leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
        {project.tags.slice(0, 5).map((tag) => (
          <span key={tag} className="tag-pill font-mono text-[10px] uppercase">
            {tag}
          </span>
        ))}
        {project.tags.length > 5 && (
          <span className="tag-pill-silver font-mono text-[10px] uppercase">
            +{project.tags.length - 5}
          </span>
        )}
      </div>

      {(project.liveUrl || project.githubUrl) && (
        <div className="flex flex-wrap items-center gap-4 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider uppercase text-primary hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
              data-ocid={`projects.live_link.${index + 1}`}
            >
              <ExternalLink size={13} aria-hidden="true" />
              Live Project
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-secondary hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
              data-ocid={`projects.source_link.${index + 1}`}
            >
              <Github size={11} aria-hidden="true" />
              View Source
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const {
    data: backendProjects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Could not load projects.");
      return (await response.json()) as Array<{
        id: number;
        title: string;
        description: string;
        techStack: string[];
        githubLink: string;
        demoLink: string;
      }>;
    },
  });

  const projectEntries: Project[] = backendProjects.map((project, index) => {
    const existing = projects.find((item) => item.title === project.title);
    return {
      id: String(project.id),
      title: project.title,
      description: project.description,
      longDescription: project.description,
      tags: project.techStack,
      featured: existing?.featured ?? index === 0,
      liveUrl: project.demoLink || undefined,
      githubUrl: project.githubLink || undefined,
      year: existing?.year ?? new Date().getFullYear(),
      category: existing?.category,
      isAcademic: existing?.isAcademic,
    };
  });
  const featured = projectEntries.filter((p) => p.featured);
  const displayed = showAll ? projectEntries : featured;

  return (
    <section
      id="projects"
      className="bg-background border-t border-border py-24 section-card-glow"
      data-ocid="projects.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={headerRef}
          className="scroll-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-2 block">
              Selected Work
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
              Projects
            </h2>
          </div>
          <p className="font-body text-base text-muted-foreground max-w-sm leading-relaxed">
            Fintech systems, AI-powered tools, and frontend dashboards — real
            work shipped.
          </p>
        </div>

        {/* Project grid */}
        {isLoading ? (
          <p className="text-muted-foreground">Loading projects…</p>
        ) : isError ? (
          <p role="alert" className="text-destructive">
            Projects could not be loaded. Check that the local API is running.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Show all toggle */}
        {projectEntries.length > featured.length && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              className="font-display text-sm tracking-wider uppercase gap-2 border border-border/40 hover:border-primary/40"
              onClick={() => setShowAll((s) => !s)}
              data-ocid="projects.toggle_button"
            >
              {showAll
                ? "Show Less"
                : `View All Projects (${projectEntries.length})`}
              <ArrowRight
                size={15}
                className={`transition-transform duration-200 ${showAll ? "rotate-90" : ""}`}
                aria-hidden="true"
              />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
