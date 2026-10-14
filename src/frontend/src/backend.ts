export type Timestamp = bigint;
export type ProjectId = bigint;
export type CertificateId = bigint;

export interface AddProjectInput {
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  demoLink?: string;
  imageAssetId?: string;
}

export interface UpdateProjectInput extends AddProjectInput {
  id: ProjectId;
}

export interface Project extends AddProjectInput {
  id: ProjectId;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AddCertificateInput {
  title: string;
  issuer: string;
  date: string;
  fileAssetId: string;
}

export interface Certificate extends AddCertificateInput {
  id: CertificateId;
  createdAt: Timestamp;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export enum ChatRole {
  user = "user",
  assistant = "assistant",
}

export interface backendInterface {
  addCertificate(input: AddCertificateInput): Promise<Certificate>;
  addProject(input: AddProjectInput): Promise<Project>;
  deleteCertificate(id: CertificateId): Promise<boolean>;
  deleteProject(id: ProjectId): Promise<boolean>;
  generateRecruiterSummary(): Promise<string>;
  getCertificate(id: CertificateId): Promise<Certificate | null>;
  getProject(id: ProjectId): Promise<Project | null>;
  getResumeAssetId(): Promise<string | null>;
  listCertificates(): Promise<Certificate[]>;
  listProjects(): Promise<Project[]>;
  sendChatMessage(history: ChatMessage[], question: string): Promise<string>;
  updateProject(input: UpdateProjectInput): Promise<boolean>;
  updateResumeAssetId(assetId: string): Promise<void>;
}

interface ApiProject extends Omit<Project, "id" | "createdAt" | "updatedAt"> {
  id: number;
}

interface ApiCertificate extends Omit<Certificate, "id" | "createdAt"> {
  id: number;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: init?.body instanceof FormData
      ? init.headers
      : { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }
  return body;
}

function toProject(project: ApiProject): Project {
  const timestamp = BigInt(Date.now()) * 1_000_000n;
  return { ...project, id: BigInt(project.id), createdAt: timestamp, updatedAt: timestamp };
}

function toCertificate(certificate: ApiCertificate): Certificate {
  return {
    ...certificate,
    id: BigInt(certificate.id),
    createdAt: BigInt(Date.now()) * 1_000_000n,
  };
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.set("file", file);
  const result = await request<{ url: string }>("/api/uploads", {
    method: "POST",
    body: formData,
  });
  return result.url;
}

export function createActor(): backendInterface {
  return {
    async addCertificate(input) {
      const result = await request<ApiCertificate>("/api/admin/certificates", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return toCertificate(result);
    },
    async addProject(input) {
      return toProject(
        await request<ApiProject>("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(input),
        }),
      );
    },
    async deleteCertificate(id) {
      const result = await request<{ success: boolean }>(
        `/api/admin/certificates/${id}`,
        { method: "DELETE" },
      );
      return result.success;
    },
    async deleteProject(id) {
      const result = await request<{ success: boolean }>(
        `/api/admin/projects/${id}`,
        { method: "DELETE" },
      );
      return result.success;
    },
    async generateRecruiterSummary() {
      throw new Error("AI recruiter summaries require an AI provider key.");
    },
    async getCertificate(id) {
      const items = await this.listCertificates();
      return items.find((item) => item.id === id) ?? null;
    },
    async getProject(id) {
      const items = await this.listProjects();
      return items.find((item) => item.id === id) ?? null;
    },
    async getResumeAssetId() {
      const result = await request<{ url: string | null }>("/api/admin/resume");
      return result.url;
    },
    async listCertificates() {
      const items = await request<ApiCertificate[]>("/api/certificates");
      return items.map(toCertificate);
    },
    async listProjects() {
      const items = await request<ApiProject[]>("/api/projects");
      return items.map(toProject);
    },
    async sendChatMessage() {
      throw new Error("AI chat requires an AI provider key.");
    },
    async updateProject(input) {
      const { id, ...project } = input;
      const result = await request<{ success: boolean }>(
        `/api/admin/projects/${id}`,
        { method: "PUT", body: JSON.stringify(project) },
      );
      return result.success;
    },
    async updateResumeAssetId(url) {
      await request("/api/admin/resume", {
        method: "PUT",
        body: JSON.stringify({ url }),
      });
    },
  };
}

export type { Project as BackendProject, Certificate as BackendCertificate };
