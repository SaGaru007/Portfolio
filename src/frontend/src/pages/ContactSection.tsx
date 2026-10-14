import { bio, socialLinks } from "@/data/portfolio-data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Github, Linkedin, Mail, MessageSquare, Phone } from "lucide-react";
import type { ReactNode } from "react";

const socialIcons: Record<string, ReactNode> = {
  github: <Github size={20} />,
  linkedin: <Linkedin size={20} />,
  email: <Mail size={20} />,
};

const contactCards = [
  {
    id: "email",
    icon: <Mail size={22} />,
    label: "Email",
    value: bio.email,
    altValue: undefined,
    href: `mailto:${bio.email}`,
    ocid: "contact.email_card",
    description: "Fastest way to reach me",
  },
  {
    id: "phone",
    icon: <Phone size={22} />,
    label: "Phone",
    value: "+91 9353240072",
    altValue: undefined,
    href: "tel:+919353240072",
    ocid: "contact.phone_card",
    description: "Available on weekdays",
  },
  {
    id: "linkedin",
    icon: <Linkedin size={22} />,
    label: "LinkedIn",
    value: "sagar-m-h",
    altValue: undefined,
    href: "https://www.linkedin.com/in/sagar-m-h-ba29322a6",
    ocid: "contact.linkedin_card",
    description: "Connect professionally",
  },
  {
    id: "github",
    icon: <Github size={22} />,
    label: "GitHub",
    value: "SaGaru007",
    altValue: undefined,
    href: "https://github.com/SaGaru007",
    ocid: "contact.github_card",
    description: "Browse my repositories",
  },
];

export function ContactSection() {
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const cardsRef = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  });
  const ctaRef = useScrollAnimation<HTMLDivElement>({
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <section
      id="contact"
      className="bg-background py-24 border-t border-border section-card-glow"
      data-ocid="contact.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="scroll-hidden mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2 bg-primary/10 border border-primary/30 rounded-md text-primary">
              <MessageSquare size={16} aria-hidden="true" />
            </span>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">
              Let&apos;s talk
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
            Get in Touch
          </h2>
          <p className="font-body text-base text-muted-foreground mt-6 max-w-2xl leading-relaxed">
            I&apos;m open to Java backend roles, Spring Boot engineering
            positions, and cloud-integrated development opportunities. If
            you&apos;re working on something challenging, I&apos;d love to hear
            about it.
          </p>
        </div>

        {/* Contact cards grid */}
        <div
          ref={cardsRef}
          className="scroll-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14"
        >
          {contactCards.map((card, i) => (
            <a
              key={card.id}
              href={card.href}
              target={
                card.id === "email" || card.id === "phone"
                  ? undefined
                  : "_blank"
              }
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-7 flex flex-col gap-5 hover:border-primary/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ transitionDelay: `${i * 60}ms` }}
              data-ocid={card.ocid}
            >
              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted border border-border text-primary group-hover:border-primary/50 transition-colors duration-200">
                {card.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-1">
                  {card.label}
                </p>
                <p className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                  {card.value}
                </p>
                {card.altValue && (
                  <a
                    href={`mailto:${card.altValue}`}
                    className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-200 truncate block mt-0.5"
                    onClick={(e) => e.stopPropagation()}
                    data-ocid="contact.alt_email_link"
                  >
                    {card.altValue}
                  </a>
                )}
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {card.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA + social row */}
        <div
          ref={ctaRef}
          className="scroll-hidden border-t border-border/40 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          data-ocid="contact.cta_panel"
        >
          <div>
            <p className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-3">
              Find me online
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  aria-label={link.label}
                  target={link.platform === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="p-2.5 bg-card border border-border rounded-lg text-secondary hover:text-primary hover:border-primary/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-ocid={`contact.social_${link.platform}`}
                >
                  {socialIcons[link.platform] ?? <Mail size={20} />}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-display text-sm text-foreground mb-1">
              Open to opportunities
            </p>
            <p className="font-body text-xs text-muted-foreground">
              Currently available for Java backend roles, backend product work,
              and freelance projects
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-2">
              <span
                className="w-2 h-2 rounded-full bg-primary"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] tracking-wider text-primary">
                {bio.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
