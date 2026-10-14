import type {
  Certificate,
  Education,
  Experience,
  PortfolioBio,
  Project,
  SkillCategory,
  SocialLink,
} from "@/types/portfolio";

export const bio: PortfolioBio = {
  name: "Sagar M H",
  title: "Full Stack Developer",
  roles: [
    "Software Engineer",
    "Full Stack Engineer",
    "Frontend Engineer",
    "Backend Engineer",
  ],
  tagline:
    "Building scalable systems and delightful UIs — from API to interface.",
  about:
    "Full Stack Developer with hands-on experience in React, Next.js, Spring Boot, and cloud-integrated solutions. Passionate about frontend design, microservices architecture, and clean code principles. Skilled in building responsive dashboards, REST APIs, and AI-powered applications.",
  location: "Hubli, Karnataka",
  email: "sagarhadapad200@gmail.com",
  phone: "9353240072",
  availableForWork: true,
};

export const coreTechnologies = [
  "Spring Boot & Microservices",
  "REST API Design",
  "AWS Cloud",
  "MySQL / JPA",
  "ActiveMQ",
  "Spring AI",
  "Java 17+",
  "React.js",
  "Postman",
  "AI-Assisted Development",
  "Claude Code",
  "GitHub Copilot Agent Coding",
];

export const projects: Project[] = [
  {
    id: "fintech-payment-integration",
    title: "Fintech Payment Integration System",
    description:
      "A comprehensive payment integration platform supporting multiple payment gateways, real-time transaction processing, and secure fund transfers. Implements UPI, NEFT, and card payment flows with robust error handling and transaction reconciliation.",
    longDescription:
      "Built a robust fintech platform integrating multiple payment gateways with real-time transaction tracking, reconciliation engines, and secure fund transfer workflows. Implemented UPI, NEFT, and card payment flows using Spring Boot and MySQL with comprehensive error handling.",
    tags: [
      "React",
      "Spring Boot",
      "Java",
      "MySQL",
      "REST APIs",
      "Payment Gateway",
    ],
    featured: true,
    githubUrl: "",
    liveUrl: "https://stripe-provider-service-19ir.onrender.com",
    year: 2025,
    category: "Backend / Full Stack",
    isAcademic: false,
  },
  {
    id: "food-ecommerce-platform",
    title: "Food E-Commerce Platform",
    description:
      "A complete online food ordering and delivery platform with product catalogs, cart management, checkout flows, and order tracking for a seamless customer experience.",
    longDescription:
      "Developed a food e-commerce application featuring restaurant listings, menu browsing, cart functionality, order placement, and delivery status updates. Built the application using a modern full-stack stack with secure APIs and responsive storefront pages.",
    tags: [
      "React",
      "Java",
      "Spring Boot",
      "MySQL",
      "REST APIs",
      "E-Commerce",
      "Swagger UI",
    ],
    featured: true,
    githubUrl: "",
    year: 2025,
    category: "Full Stack / E-Commerce",
    isAcademic: false,
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "🎨",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Claude Code",
      "GitHub Copilot Agent",
      "AI-Assisted Development",
    ],
  },
  {
    name: "Backend",
    icon: "☕",
    skills: [
      "Java",
      "Spring Boot",
      "Microservices",
      "REST APIs",
      "API Documentation",
      "Swagger UI",
      "Postman",
      "API Integration",
      "SpringAI",
    ],
  },
  {
    name: "Database & Storage",
    icon: "🗄️",
    skills: ["MySQL", "AWS RDS", "JPA/Hibernate", "SQL"],
  },
  {
    name: "Cloud & DevOps",
    icon: "☁️",
    skills: ["AWS EC2", "AWS RDS", "Elastic Beanstalk", "Git", "GitHub"],
  },
  {
    name: "Design & Tools",
    icon: "🛠️",
    skills: ["Excalidraw", "Eclipse", "Agile/Scrum", "VS Code"],
  },
];

export const experience: Experience[] = [
  {
    company: "Cepia Labs",
    role: "Full Stack Developer | Frontend Developer",
    period: "December 2025 – April 2026",
    description:
      "Built and designed frontend dashboard pages using React and Next.js. Created interactive UI components and design prototypes with Excalidraw. Contributed to full-stack features and dashboard architecture.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Excalidraw"],
  },
  {
    company: "HulkHire",
    role: "Java Developer Trainee",
    period: "Aug 2025 – Sep 2025",
    description:
      "Built a fintech project integrating Stripe Payments, Spring Boot, REST APIs, and MySQL. Worked with microservices, SpringAI, Postman, Swagger UI, API documentation, API integration, and Agile/Scrum workflows. Deployed services using AWS EC2, Elastic Beanstalk, and RDS.",
    tech: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "Postman",
      "Swagger UI",
      "API Documentation",
      "API Integration",
      "MySQL",
      "AWS EC2",
    ],
  },
];

export const education: Education[] = [
  {
    institution: "Alva's Institute of Engineering and Technology",
    degree: "Bachelor of Engineering in Computer Science",
    period: "2021 – 2025",
    gpa: "7.44 / 10",
  },
  {
    institution:
      "K.L.E. Society's P.C. Jabin Science College, Vidyanagar, Hubli",
    degree: "Science",
    period: "2019 – 2021",
    gpa: "67 / 100",
    scoreLabel: "Percentage",
  },
];

export const certificates: Certificate[] = [
  {
    id: "salesforce-admin",
    title: "Salesforce Administrator",
    issuer: "Trailhead",
    date: "2024",
  },
  {
    id: "java-wipro-fullstack",
    title: "Java Wipro Fullstack Certification",
    issuer: "Wipro",
    date: "2024",
  },
  {
    id: "spring-boot-gcp",
    title: "Spring Boot Microservices Application with GCP Cloud",
    issuer: "Coursera",
    date: "2025",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "github",
    url: "https://github.com/SaGaru007",
    label: "GitHub",
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/sagar-m-h-ba29322a6",
    label: "LinkedIn",
  },
  {
    platform: "email",
    url: `mailto:${bio.email}`,
    label: "Email",
  },
];
