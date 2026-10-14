import { Layout } from "@/components/Layout";
import { AboutSection } from "@/pages/AboutSection";
import { CertificatesSection } from "@/pages/CertificatesSection";
import { ContactSection } from "@/pages/ContactSection";
import { EducationSection } from "@/pages/EducationSection";
import { ExperienceSection } from "@/pages/ExperienceSection";
import { HeroSection } from "@/pages/HeroSection";
import { ProjectsSection } from "@/pages/ProjectsSection";
import { SkillsSection } from "@/pages/SkillsSection";

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <CertificatesSection />
      <ContactSection />
    </Layout>
  );
}
