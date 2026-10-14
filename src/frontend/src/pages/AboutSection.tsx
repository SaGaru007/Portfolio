import { bio, coreTechnologies } from "@/data/portfolio-data";
import { usePortfolioSettings } from "@/hooks/use-portfolio-settings";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Phone, Zap } from "lucide-react";

const avatarInitials = bio.name
  .split(" ")
  .map((w) => w[0])
  .join("");

export function AboutSection() {
  const { data: settings } = usePortfolioSettings();
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const avatarRef = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });
  const bioRef = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });
  const skillsRef = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });

  const storedTechnologies = settings?.core_technologies
    ? JSON.parse(settings.core_technologies)
    : coreTechnologies;
  const highlights = Array.isArray(storedTechnologies)
    ? storedTechnologies.filter(
        (item): item is string => typeof item === "string",
      )
    : coreTechnologies;

  return (
    <section
      id="about"
      className="bg-background border-t border-border py-24 section-card-glow"
      data-ocid="about.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="scroll-hidden mb-16">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-2 block">
            Background
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Sidebar — avatar + quick facts */}
          <div
            ref={avatarRef}
            className="scroll-hidden-left flex flex-col items-center lg:items-start gap-8"
            data-ocid="about.avatar_panel"
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-32 h-32 rounded-xl border-2 border-primary/40 flex items-center justify-center overflow-hidden shadow-orange-glow"
                style={{
                  background: "#080A0C",
                }}
                aria-hidden="true"
              >
                <span className="font-display font-bold text-4xl gradient-text-orange tracking-wider select-none">
                  {avatarInitials}
                </span>
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-bottom-2 lg:-right-3">
                <span className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase bg-primary text-black px-2 py-0.5 rounded-full shadow-orange-glow">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-black"
                    aria-hidden="true"
                  />
                  Available
                </span>
              </div>
            </div>

            {/* Quick facts */}
            <dl className="w-full space-y-0 divide-y divide-border/40">
              <div className="flex items-center gap-3 py-3">
                <MapPin size={14} className="text-primary shrink-0" />
                <div>
                  <dt className="font-mono text-[9px] tracking-wider uppercase text-muted-foreground">
                    Location
                  </dt>
                  <dd className="font-body text-base text-muted-foreground">
                    {bio.location}
                  </dd>
                </div>
              </div>
              {bio.phone && (
                <div className="flex items-center gap-3 py-3">
                  <Phone size={14} className="text-primary shrink-0" />
                  <div>
                    <dt className="font-mono text-[9px] tracking-wider uppercase text-muted-foreground">
                      Phone
                    </dt>
                    <dd className="font-body text-base text-muted-foreground">
                      +91 {bio.phone}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {/* Main content — bio + skills */}
          <div className="space-y-10 lg:col-span-2">
            {/* Bio */}
            <div
              ref={bioRef}
              className="scroll-hidden delay-100"
              data-ocid="about.bio_panel"
            >
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                {bio.about}
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Committed to writing clean, maintainable Java code and building
                systems that scale. Currently exploring the intersection of AI
                and backend development with SpringAI, while deepening expertise
                in AWS cloud infrastructure and microservices patterns.
              </p>
            </div>

            {/* Core skills highlight chips */}
            <div
              ref={skillsRef}
              className="scroll-hidden delay-200"
              data-ocid="about.skills_panel"
            >
              <div className="flex items-center gap-2 mb-5">
                <Zap size={14} className="text-primary" aria-hidden="true" />
                <h3 className="font-display font-bold text-base tracking-wider uppercase text-foreground">
                  Core Technologies
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {highlights.map((skill, i) => (
                  <span
                    key={skill}
                    className="tag-pill"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
