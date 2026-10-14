import { skillCategories } from "@/data/portfolio-data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { SkillCategory } from "@/types/portfolio";

function SkillCategoryCard({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const ref = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <div
      ref={ref}
      className="scroll-hidden bg-card border border-border rounded-lg p-7 flex flex-col gap-6 hover:border-primary/50 transition-colors duration-200"
      style={{ transitionDelay: `${index * 80}ms` }}
      data-ocid={`skills.category.${index + 1}`}
    >
      {/* Category header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span
          className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10 border border-primary/20 text-lg leading-none"
          aria-hidden="true"
        >
          {category.icon ?? "◆"}
        </span>
        <h3 className="font-display font-bold text-base tracking-wider uppercase text-foreground">
          {category.name}
        </h3>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="tag-pill inline-flex items-center tracking-wide hover:border-primary/60 transition-colors duration-200 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const headerRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section
      id="skills"
      className="bg-background py-24 border-t border-border section-card-glow"
      data-ocid="skills.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={headerRef}
          className="scroll-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-2 block">
              Expertise
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
              Skills
            </h2>
          </div>
          <p className="font-body text-base text-muted-foreground max-w-md leading-relaxed">
            Technologies I reach for to build robust, scalable backend systems
            and cloud deployments.
          </p>
        </div>

        {/* Skill category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skillCategories.map((cat, i) => (
            <SkillCategoryCard key={cat.name} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
