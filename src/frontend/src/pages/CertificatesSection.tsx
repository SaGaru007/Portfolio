import { Card, CardBody, CardFooter, CardHeader } from "@/components/Card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useScrollAnimation,
  useStaggeredScroll,
} from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { Award, Calendar, Download, Shield, Star } from "lucide-react";

// Display-level certificate shape
interface DisplayCertificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  fileAssetId?: string;
}

const CERT_ICONS = [Award, Shield, Star, Award, Shield, Star] as const;

function CertificateCard({
  cert,
  index,
}: {
  cert: DisplayCertificate;
  index: number;
}) {
  const IconComponent = CERT_ICONS[index % CERT_ICONS.length];
  const certificateHeading = (
    <div className="flex-1 min-w-0">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-1 truncate">
        {cert.issuer}
      </p>
      <h3 className="font-display font-bold text-base leading-snug text-foreground line-clamp-2">
        {cert.title}
      </h3>
    </div>
  );

  return (
    <article
      className="scroll-hidden group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-200"
      style={{ transitionDelay: `${index * 80}ms` }}
      data-stagger
      data-ocid={`certificates.item.${index + 1}`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-primary/70" />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-muted border border-border flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors duration-200">
            <IconComponent
              size={20}
              className="text-primary"
              aria-hidden="true"
            />
          </div>
          {cert.fileAssetId ? (
            <a
              href={cert.fileAssetId}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${cert.title} certificate`}
              className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              data-ocid={`certificates.open_link.${index + 1}`}
            >
              <div className="group-hover:text-primary transition-colors duration-200">
                {certificateHeading}
              </div>
            </a>
          ) : (
            certificateHeading
          )}
        </div>
      </CardHeader>

      <CardBody className="flex-1 py-0 pb-3">
        <div className="flex items-center gap-1.5">
          <Calendar
            size={11}
            className="text-secondary shrink-0"
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] tracking-wider text-secondary">
            {cert.date}
          </span>
        </div>
      </CardBody>

      {cert.fileAssetId && (
        <CardFooter className="py-3">
          <a
            href={cert.fileAssetId}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label={`View ${cert.title} certificate`}
            data-ocid={`certificates.download_link.${index + 1}`}
          >
            <Download size={11} aria-hidden="true" />
            View Certificate
          </a>
        </CardFooter>
      )}
    </article>
  );
}

function CertCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="bg-card border border-border/40 rounded-xl p-5 space-y-3"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function CertificatesSection() {
  const {
    data: backendCerts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const response = await fetch("/api/certificates");
      if (!response.ok) throw new Error("Could not load certificates.");
      return (await response.json()) as Array<{
        id: number;
        title: string;
        issuer: string;
        date: string;
        fileAssetId: string;
      }>;
    },
  });

  const displayCerts: DisplayCertificate[] = backendCerts.map((c) => ({
    id: String(c.id),
    title: c.title,
    issuer: c.issuer,
    date: c.date,
    fileAssetId: c.fileAssetId || undefined,
  }));

  const headerRef = useScrollAnimation<HTMLDivElement>();
  const gridRef = useStaggeredScroll<HTMLDivElement>("[data-stagger]");

  return (
    <section
      id="certificates"
      className="bg-background border-t border-border py-24 section-card-glow"
      data-ocid="certificates.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={headerRef}
          className="scroll-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-2 block">
              Credentials
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground section-title">
              Certificates
            </h2>
          </div>
          <p className="font-body text-base text-muted-foreground max-w-sm leading-relaxed">
            Professional certifications validating expertise in cloud, Java, and
            backend development.
          </p>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="certificates.loading_state"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton indices are stable
              <CertCardSkeleton key={i} index={i} />
            ))}
          </div>
        )}
        {isError && (
          <p role="alert" className="mb-5 text-destructive">
            Certificates could not be loaded. Check that the local API is
            running.
          </p>
        )}

        {/* Certificate grid */}
        {!isLoading && displayCerts.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayCerts.map((cert, i) => (
              <CertificateCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && displayCerts.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="certificates.empty_state"
          >
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-4 shadow-orange-glow">
              <Award size={28} className="text-primary" aria-hidden="true" />
            </div>
            <p className="font-display font-bold text-base text-foreground mb-1">
              No certificates yet
            </p>
            <p className="font-body text-sm text-muted-foreground max-w-xs">
              Certificates will appear here once uploaded from the admin
              dashboard.
            </p>
          </div>
        )}

        {/* Count badge */}
        {!isLoading && displayCerts.length > 0 && (
          <div className="mt-10 flex justify-center">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground px-4 py-1.5 rounded-full border border-border/40">
              <Award size={11} className="text-primary" aria-hidden="true" />
              {displayCerts.length} certification
              {displayCerts.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
