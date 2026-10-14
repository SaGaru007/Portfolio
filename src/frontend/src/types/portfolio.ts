export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  year: number;
  imageUrl?: string;
  category?: string;
  isAcademic?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  fileUrl?: string;
  fileAssetId?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa?: string;
  scoreLabel?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface PortfolioBio {
  name: string;
  title: string;
  roles: string[];
  tagline: string;
  about: string;
  location: string;
  email: string;
  alternativeEmail?: string;
  phone?: string;
  availableForWork: boolean;
  profilePhotoAssetId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface AdminProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  demoLink?: string;
  githubLink?: string;
  imageAssetId?: string;
}
