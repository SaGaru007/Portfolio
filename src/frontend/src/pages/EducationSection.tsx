import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Education } from "@/types/portfolio";
import { useQuery } from "@tanstack/react-query";
import { Award, CalendarDays, GraduationCap } from "lucide-react";

function EducationCard({
  edu,
  index,
}: {
  edu: Education;
  index: number;
}) {
  const ref = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <div
      ref={ref}
      className="scroll-hidden"
      style={{ transitionDelay: `${index * 100}ms` }}
      data-ocid={`education.item.${index + 1}`}
    >
      <div className="relative bg-card border border-border rounded-xl p-6 sm:p-8 overflow-hidden group hover:border-primary/50 transition-colors duration-200">
        {/* Top row: icon + period */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="p-2.5 bg-primary/10 border border-primary/25 rounded-lg text-primary shrink-0">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-secondary bg-muted border border-border rounded-sm px-2.5 py-1">
            <CalendarDays size={11} aria-hidden="true" />
            {edu.period}
          </span>
        </div>

        {/* Degree */}
        <h3 className="font-display font-bold text-lg sm:text-xl tracking-tight text-foreground mb-1 leading-snug">
          {edu.degree}
        </h3>

        {/* Institution */}
        <p className="font-display font-semibold text-base text-primary mb-4">
          {edu.institution}
        </p>

        {/* GPA badge */}
        {edu.gpa && (
          <div className="flex items-center gap-2 pt-4 border-t border-border/40">
            <Award
              size={13}
              className="text-secondary shrink-0"
              aria-hidden="true"
            />
            <span className="font-mono text-xs tracking-wider text-muted-foreground">
              {edu.scoreLabel ?? "GPA"}:&nbsp;
              <span className="text-secondary font-bold">{edu.gpa}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function EducationSection() {
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const {
    data: education = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const response = await fetch("/api/education");
      if (!response.ok) throw new Error("Could not load education.");
      return (await response.json()) as Education[];
    },
  });

  return (
    <section
      id="education"
      className="bg-background border-t border-border py-24 section-card-glow"
      data-ocid="education.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="scroll-hidden mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2 bg-primary/10 border border-primary/30 rounded-md text-primary">
              <GraduationCap size={16} aria-hidden="true" />
            </span>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">
              Academics
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
            Education
          </h2>
          <p className="font-body text-base text-muted-foreground mt-6 max-w-lg leading-relaxed">
            Academic foundation in computer science and engineering that drives
            my approach to problem-solving and system design.
          </p>
        </div>

        {/* Education cards grid */}
        {isLoading && (
          <p className="text-muted-foreground">Loading education…</p>
        )}
        {isError && (
          <p role="alert" className="text-destructive">
            Education could not be loaded. Check that the local API is running.
          </p>
        )}
        <div
          className={
            education.length === 1
              ? "max-w-lg"
              : "grid grid-cols-1 sm:grid-cols-2 gap-6"
          }
        >
          {education.map((edu, i) => (
            <EducationCard key={edu.institution} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
