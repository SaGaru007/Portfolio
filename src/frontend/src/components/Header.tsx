import { usePortfolioSettings } from "@/hooks/use-portfolio-settings";
import { Link, useLocation } from "@tanstack/react-router";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUnavailable, setLogoUnavailable] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { data: settings } = usePortfolioSettings();
  const resumeUrl = settings?.resume_url || undefined;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href: string) => {
    if (isHome) scrollToSection(href);
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background border-b border-border"
      }`}
      data-ocid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="font-display font-bold text-lg tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            data-ocid="header.brand_link"
            aria-label="Sagar M H home"
          >
            {logoUnavailable ? (
              <span className="text-foreground">Sagar</span>
            ) : (
              <img
                src="/assets/images/logo/Sagar_logo_mark.png"
                alt="Sagar M H"
                className="h-10 w-auto max-w-none object-contain brightness-0 invert"
                onError={() => setLogoUnavailable(true)}
              />
            )}
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="font-display text-xs font-semibold tracking-wider uppercase text-secondary hover:text-foreground px-3 py-2 rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted"
                data-ocid={`header.nav_${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}

            {/* Resume download — blue accent */}
            <a
              href={resumeUrl ? "/resume" : undefined}
              download="Sagar-M-H-Resume.pdf"
              aria-disabled={!resumeUrl}
              title={
                resumeUrl
                  ? "Download resume"
                  : "Upload a resume from the admin page to enable downloads"
              }
              className={`ml-2 inline-flex items-center gap-1.5 font-display text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${resumeUrl ? "hover:brightness-110" : "opacity-60 pointer-events-none"}`}
              style={{
                background: "#00D9FF",
                color: "#050505",
              }}
              data-ocid="header.resume_download_button"
            >
              <Download size={12} aria-hidden="true" />
              Resume
            </a>

            <Link
              to="/admin"
              className="ml-1 font-display text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-sm text-secondary hover:text-foreground transition-all duration-200 focus-visible:outline-none"
              data-ocid="header.admin_link"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-sm text-secondary hover:text-foreground hover:bg-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-ocid="header.hamburger_button"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="lg:hidden border-t border-border bg-background pb-4 px-4"
          aria-label="Mobile navigation"
          data-ocid="header.mobile_menu"
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left font-display text-xs font-semibold tracking-wider uppercase text-secondary hover:text-foreground py-3 px-2 border-b border-border last:border-0 transition-colors duration-200 focus-visible:outline-none"
              data-ocid={`header.mobile_nav_${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          ))}

          <div className="flex gap-2 mt-4">
            <a
              href={resumeUrl ? "/resume" : undefined}
              download="Sagar-M-H-Resume.pdf"
              onClick={() => setMenuOpen(false)}
              aria-disabled={!resumeUrl}
              title={
                resumeUrl
                  ? "Download resume"
                  : "Upload a resume from the admin page to enable downloads"
              }
              className={`flex-1 inline-flex items-center justify-center gap-1.5 font-display text-xs font-bold tracking-wider uppercase py-2.5 rounded-sm transition-all duration-200 ${resumeUrl ? "hover:brightness-110" : "opacity-60 pointer-events-none"}`}
              style={{ background: "#00D9FF", color: "#050505" }}
              data-ocid="header.mobile_resume_download_button"
            >
              <Download size={12} aria-hidden="true" />
              Resume
            </a>
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="font-display text-xs tracking-wider uppercase px-3 py-2.5 rounded-sm text-secondary border border-border hover:text-foreground transition-all duration-200"
              data-ocid="header.mobile_admin_link"
            >
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
