import { bio } from "@/data/portfolio-data";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

interface FooterLink {
  icon: ReactNode;
  href: string;
  label: string;
  external: boolean;
}

const socialLinks: FooterLink[] = [
  {
    icon: <Github size={18} />,
    href: "https://github.com/SaGaru007",
    label: "GitHub",
    external: true,
  },
  {
    icon: <Linkedin size={18} />,
    href: "https://www.linkedin.com/in/sagar-m-h-ba29322a6",
    label: "LinkedIn",
    external: true,
  },
  {
    icon: <Mail size={18} />,
    href: `mailto:${bio.email}`,
    label: "Email",
    external: false,
  },
];

interface ContactItem {
  icon: ReactNode;
  text: string;
  href: string | undefined;
  label: string;
}

const buildContactInfo = (): ContactItem[] => {
  const items: ContactItem[] = [
    {
      icon: <MapPin size={13} />,
      text: bio.location,
      href: undefined,
      label: bio.location,
    },
  ];
  if (bio.phone) {
    items.splice(1, 0, {
      icon: <Phone size={13} />,
      text: bio.phone,
      href: `tel:+91${bio.phone}`,
      label: "Call Sagar",
    });
  }
  return items;
};

const contactInfo = buildContactInfo();

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border/40"
      style={{ background: "#050505" }}
      data-ocid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <span className="font-display font-bold text-base tracking-widest uppercase">
              <span className="gradient-text-blue">
                {bio.name.split(" ")[0]}
              </span>
              <span className="ml-1.5 text-foreground">
                {bio.name.split(" ").slice(1).join(" ")}
              </span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {bio.title}
            </span>
            <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-xs mt-1">
              {bio.tagline}
            </p>
          </div>

          {/* Contact details */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1 text-secondary">
              Contact
            </span>
            {contactInfo.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none"
                  data-ocid={`footer.contact_${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  <span className="text-secondary">{item.icon}</span>
                  {item.text}
                </a>
              ) : (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground"
                >
                  <span className="text-secondary">{item.icon}</span>
                  {item.text}
                </span>
              ),
            )}
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1 text-secondary">
              Connect
            </span>
            <nav aria-label="Social links" className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm group"
                  data-ocid={`footer.${link.label.toLowerCase()}_link`}
                >
                  <span className="text-secondary group-hover:text-primary transition-colors duration-200">
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-secondary">
            © {year} {bio.name} — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
