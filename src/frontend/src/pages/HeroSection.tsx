import { Button } from "@/components/ui/button";
import { bio } from "@/data/portfolio-data";
import { usePortfolioSettings } from "@/hooks/use-portfolio-settings";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTypewriter } from "@/hooks/useTypewriter";
import {
  ArrowDown,
  Camera,
  Download,
  Github,
  Linkedin,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Reads the profile photo asset ID from localStorage (set by admin panel) */
function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("profile_photo_data_url");
    if (stored) setPhotoUrl(stored);

    const handler = () => {
      const updated = localStorage.getItem("profile_photo_data_url");
      setPhotoUrl(updated);
    };
    window.addEventListener("portfolio:photo-updated", handler);
    return () => window.removeEventListener("portfolio:photo-updated", handler);
  }, []);

  return photoUrl;
}

function ProfilePhotoCard({ photoUrl }: { photoUrl: string | null }) {
  return (
    <div
      className="relative flex flex-col items-center gap-3"
      data-ocid="hero.profile_photo_card"
      aria-label="Profile photo"
    >
      {/* Card */}
      <div
        className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl border-2 overflow-hidden flex items-center justify-center"
        style={{
          borderColor: "#16404C",
          background: "#080A0C",
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Sagar M H"
            className="w-full h-full object-cover"
          />
        ) : (
          /* Initials placeholder */
          <div
            className="w-full h-full flex flex-col items-center justify-center select-none"
            style={{
              background: "#080A0C",
            }}
          >
            <span
              className="font-display font-bold text-5xl tracking-tight"
              style={{
                color: "#00D9FF",
              }}
            >
              SMH
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 mt-1">
              Portfolio
            </span>
            <div className="mt-3">
              <Camera
                size={14}
                className="text-muted-foreground/30"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>

      {/* Label card */}
      <div
        className="relative w-full max-w-[224px] sm:max-w-[256px] rounded-lg border px-4 py-3 text-center"
        style={{
          borderColor: "#17232C",
          background: "#080A0C",
        }}
      >
        <p className="font-display font-bold text-base tracking-tight text-foreground">
          Sagar M H
        </p>
        <p className="font-mono text-[10px] tracking-widest uppercase text-primary mt-1">
          Full Stack Developer
        </p>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data: settings } = usePortfolioSettings();
  const { displayText } = useTypewriter({
    words: bio.roles,
    typeSpeed: 70,
    deleteSpeed: 35,
    pauseOnComplete: 2200,
  });

  const localPhotoUrl = useProfilePhoto();
  const photoUrl = settings?.photo_url || localPhotoUrl;
  const resumeUrl = settings?.resume_url || undefined;

  const badgeRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const headingRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const roleRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const ctaRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const statsRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const photoRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center bg-background overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Layered radial glows */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] pointer-events-none opacity-[0.06]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at top left, #00D9FF 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[500px] pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, #8494A7 0%, transparent 65%)",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(132,148,167,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(132,148,167,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px h-full pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, transparent, #00D9FF, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full relative z-10">
        {/* Two-column layout: text left, photo right */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-10 lg:gap-16">
          {/* Left — text content */}
          <div className="flex-1 min-w-0">
            {/* Status + location */}
            <div
              ref={badgeRef}
              className="flex flex-wrap items-center gap-3 mb-10 scroll-hidden"
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase border border-primary/40 rounded-sm px-3 py-1.5 text-primary bg-primary/5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
                Available for work
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-muted-foreground border border-border/40 rounded-sm px-3 py-1.5">
                <MapPin size={11} aria-hidden="true" />
                {bio.location}
              </span>
            </div>

            {/* Main heading */}
            <div ref={headingRef} className="scroll-hidden delay-100 mb-2">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Hello, I'm
              </p>
              <h1 className="font-display font-bold leading-[0.95] tracking-tight text-foreground">
                <span className="block whitespace-nowrap text-foreground text-[clamp(2.5rem,8vw,8rem)]">
                  {bio.name}
                </span>
              </h1>
            </div>

            {/* Typewriter role */}
            <div
              ref={roleRef}
              className="scroll-hidden delay-200 flex items-center gap-5 my-8 min-h-16"
            >
              <span
                className="shrink-0 w-12 h-[2px] rounded-full"
                aria-hidden="true"
                style={{
                  background: "#00D9FF",
                }}
              />
              <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-primary typewriter-cursor tracking-tight min-w-0">
                {displayText}
              </span>
            </div>

            {/* Bio line */}
            <p className="font-body text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-12 scroll-hidden delay-200">
              {bio.about}
            </p>

            {/* CTA row */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-4 scroll-hidden delay-300"
            >
              <Button
                type="button"
                size="lg"
                className="font-display text-base tracking-wider uppercase shadow-orange-glow hover:shadow-none transition-all duration-300"
                onClick={() => scrollToSection("projects")}
                data-ocid="hero.view_work_button"
              >
                View Work
              </Button>

              <a
                href={resumeUrl ? "/resume" : undefined}
                download="Sagar-M-H-Resume.pdf"
                aria-disabled={!resumeUrl}
                title={
                  resumeUrl
                    ? "Download resume"
                    : "Upload a resume from the admin page to enable downloads"
                }
                className={`inline-flex items-center justify-center gap-2 font-display text-base tracking-wider uppercase h-12 px-7 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${resumeUrl ? "hover:brightness-110" : "opacity-60 pointer-events-none"}`}
                style={{ background: "#00D9FF", color: "#050505" }}
                data-ocid="hero.resume_download_button"
              >
                <Download size={15} aria-hidden="true" />
                Resume
              </a>

              <a
                href="https://github.com/SaGaru007"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-display text-base tracking-wider uppercase h-12 px-6 rounded-md border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid="hero.github_link"
              >
                <Github size={15} aria-hidden="true" />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/sagar-m-h-ba29322a6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-display text-base tracking-wider uppercase h-12 px-6 rounded-md border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid="hero.linkedin_link"
              >
                <Linkedin size={15} aria-hidden="true" />
                LinkedIn
              </a>
            </div>

            {/* Stats + contact */}
            <div
              ref={statsRef}
              className="flex flex-wrap gap-12 mt-20 pt-12 border-t border-border/20 scroll-hidden delay-400"
            >
              {[
                { value: "2", label: "Projects Shipped" },
                { value: "2", label: "Internships" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="font-display font-bold text-4xl gradient-text-orange">
                    {stat.value}
                  </span>
                  <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Profile Photo Card */}
          <div
            ref={photoRef}
            className="flex justify-center sm:justify-end shrink-0 scroll-hidden delay-100 sm:self-start sm:-mt-4 sm:pl-2"
          >
            <ProfilePhotoCard photoUrl={photoUrl} />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        type="button"
        onClick={() => scrollToSection("about")}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        data-ocid="hero.scroll_indicator"
      >
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase opacity-50">
          scroll
        </span>
        <ArrowDown size={18} />
      </button>
    </section>
  );
}
