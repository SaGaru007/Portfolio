import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Experience } from "@/types/portfolio";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CalendarDays } from "lucide-react";

function ExperienceCard({
  exp,
  index,
  isLast,
}: {
  exp: Experience;
  index: number;
  isLast: boolean;
}) {
  const ref = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <div
      ref={ref}
      className="scroll-hidden-right relative pl-10"
      style={{ transitionDelay: `${index * 120}ms` }}
      data-ocid={`experience.item.${index + 1}`}
    >
      {/* Timeline connector */}
      {!isLast && (
        <div
          className="absolute left-[18px] top-9 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border/50 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Timeline dot */}
      <div
        className="absolute left-3 top-2 w-3 h-3 rounded-full border-2 border-primary bg-background"
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="bg-card border border-border rounded-lg p-7 sm:p-8 mb-7 hover:border-primary/50 transition-colors duration-200 group">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-bold text-lg tracking-tight text-foreground transition-colors duration-200">
              {exp.role}
            </h3>
            <p className="font-display font-semibold text-base text-primary mt-1">
              {exp.company}
            </p>
          </div>
          <span className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-secondary bg-muted/40 border border-border rounded-sm px-3 py-1.5 shrink-0">
            <CalendarDays size={11} aria-hidden="true" />
            {exp.period}
          </span>
        </div>

        {/* Description */}
        <p className="font-body text-base font-normal not-italic text-muted-foreground leading-[1.7] mb-5">
          {exp.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 pt-5 border-t border-border/40">
          {exp.tech.map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const {
    data: experience = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const response = await fetch("/api/experience");
      if (!response.ok) throw new Error("Could not load experience.");
      return (await response.json()) as Experience[];
    },
  });
  const timelineRef = useScrollAnimation<HTMLDivElement>({
    threshold: 0.05,
    rootMargin: "0px 0px -30px 0px",
  });

  return (
    <section
      id="experience"
      className="bg-background py-24 border-t border-border section-card-glow"
      data-ocid="experience.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="scroll-hidden mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2 bg-primary/10 border border-primary/30 rounded-md text-primary">
              <Briefcase size={16} aria-hidden="true" />
            </span>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">
              Career
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
            Experience
          </h2>
          <p className="font-body text-base text-muted-foreground mt-6 max-w-2xl leading-relaxed">
            My professional journey — from building frontend dashboards and
            React UIs to Java backends, REST APIs, and cloud-hosted services.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {isLoading && (
            <p className="text-muted-foreground">Loading experience…</p>
          )}
          {isError && (
            <p role="alert" className="text-destructive">
              Experience could not be loaded. Check that the local API is
              running.
            </p>
          )}
          {experience.map((exp, i) => (
            <ExperienceCard
              key={`${exp.company}-${exp.period}`}
              exp={exp}
              index={i}
              isLast={i === experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
