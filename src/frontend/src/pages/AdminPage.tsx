import { createActor, uploadFile } from "@/backend";
import type {
  AddCertificateInput,
  AddProjectInput,
  Certificate,
  Project,
  UpdateProjectInput,
} from "@/backend";
import { Card, CardBody, CardHeader, Tag } from "@/components/Card";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  coreTechnologies as defaultCoreTechnologies,
  education as defaultEducation,
  experience as defaultExperience,
} from "@/data/portfolio-data";
import { usePortfolioSettings } from "@/hooks/use-portfolio-settings";
import { useLocalAdminAuth } from "@/lib/local-admin-auth";
import type { Education, Experience } from "@/types/portfolio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Briefcase,
  Camera,
  Check,
  Edit2,
  FolderOpen,
  GraduationCap,
  Lock,
  LogIn,
  LogOut,
  Plus,
  Shield,
  Trash2,
  Upload,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type AdminTab =
  | "projects"
  | "certificates"
  | "resume"
  | "photo"
  | "experience"
  | "education"
  | "core-tech";

// ─── Login Gate ──────────────────────────────────────────────────────────────

function LoginGate({
  onLogin,
}: {
  onLogin: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    setError("");
    try {
      await onLogin(password);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl border border-primary/40 bg-primary/10 mb-4 shadow-orange-glow">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight gradient-text-silver">
            Admin Dashboard
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Portfolio management — sign in to continue
          </p>
        </div>
        <div className="bg-card border border-border/60 rounded-xl p-8 shadow-card">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <Lock size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                This dashboard is protected. Enter the local administrator
                password to manage this portfolio.
              </p>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleLogin();
              }}
              placeholder="Admin password"
              autoComplete="current-password"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              onClick={() => void handleLogin()}
              disabled={submitting || !password}
              className="w-full font-display text-sm tracking-wider uppercase gap-2 shadow-orange-glow"
              data-ocid="admin.login_button"
            >
              <LogIn size={16} />
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared field components ──────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground">
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
  );
}

// ─── Profile Photo Tab ────────────────────────────────────────────────────────

function ProfilePhotoTab() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(() =>
    localStorage.getItem("profile_photo_data_url"),
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!file || !preview) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      const response = await fetch("/api/admin/settings/photo_url", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: url }),
      });
      if (!response.ok) throw new Error("Could not save the profile photo.");
      localStorage.setItem("profile_photo_data_url", url);
      await queryClient.invalidateQueries({ queryKey: ["portfolio-settings"] });
      window.dispatchEvent(new Event("portfolio:photo-updated"));
      toast.success("Profile photo updated successfully");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save photo",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/admin/settings/photo_url", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: "" }),
      });
      if (!response.ok) throw new Error("Could not remove the profile photo.");
      await queryClient.invalidateQueries({ queryKey: ["portfolio-settings"] });
      localStorage.removeItem("profile_photo_data_url");
      setPreview(null);
      setFile(null);
      window.dispatchEvent(new Event("portfolio:photo-updated"));
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not remove photo.",
      );
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Current photo preview */}
      <div className="p-4 bg-card border border-border/50 rounded-lg">
        <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-3">
          Current Photo
        </p>
        {preview ? (
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-primary/30 shrink-0">
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-body text-sm text-foreground">
                  Photo active
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="font-mono text-xs text-destructive/70 hover:text-destructive transition-colors duration-200 text-left"
                data-ocid="admin.remove_photo_button"
              >
                Remove photo
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-center">
              <User
                size={24}
                className="text-muted-foreground/40"
                aria-hidden="true"
              />
            </div>
            <span className="font-body text-sm text-muted-foreground">
              No photo uploaded yet
            </span>
          </div>
        )}
      </div>

      {/* Upload form */}
      <Card variant="glass" hover={false} className="border-primary/20">
        <CardHeader>
          <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            <Camera size={16} className="text-primary" />
            Upload Profile Photo
          </h3>
          <p className="font-body text-xs text-muted-foreground mt-1">
            This photo will appear on the hero section of your portfolio.
          </p>
        </CardHeader>
        <CardBody>
          <label
            htmlFor="photo-file"
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 mb-4 overflow-hidden"
            data-ocid="admin.photo_dropzone"
          >
            {file && preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Camera size={24} className="text-muted-foreground mb-2" />
                <span className="font-mono text-sm text-muted-foreground">
                  Click to choose photo
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60 mt-1">
                  JPG, PNG, WEBP — max 5MB
                </span>
              </>
            )}
            <input
              id="photo-file"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full font-display text-sm tracking-wider uppercase gap-2 shadow-orange-glow"
            data-ocid="admin.upload_photo_button"
          >
            {uploading ? <Spinner /> : <Upload size={15} />}
            {uploading ? "Saving..." : "Save Profile Photo"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

interface EditingProject {
  id: bigint;
  title: string;
  description: string;
  techStack: string;
  githubLink: string;
  demoLink: string;
}

function ProjectsTab({ actor }: { actor: ReturnType<typeof createActor> }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [editing, setEditing] = useState<EditingProject | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["admin-projects"],
    queryFn: () => actor.listProjects(),
  });

  const addMutation = useMutation({
    mutationFn: (input: AddProjectInput) => actor.addProject(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added successfully");
      setTitle("");
      setDesc("");
      setTech("");
      setGithub("");
      setDemo("");
    },
    onError: () => toast.error("Failed to add project"),
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProjectInput) => actor.updateProject(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated");
      setEditing(null);
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => actor.deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const handleAdd = () => {
    if (!title.trim() || !desc.trim()) return;
    addMutation.mutate({
      title: title.trim(),
      description: desc.trim(),
      techStack: tech
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      githubLink: github.trim() || undefined,
      demoLink: demo.trim() || undefined,
    });
  };

  const handleUpdate = () => {
    if (!editing || !editing.title.trim() || !editing.description.trim())
      return;
    updateMutation.mutate({
      id: editing.id,
      title: editing.title.trim(),
      description: editing.description.trim(),
      techStack: editing.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      githubLink: editing.githubLink.trim() || undefined,
      demoLink: editing.demoLink.trim() || undefined,
    });
  };

  return (
    <div className="space-y-8">
      <Card variant="glass" hover={false} className="border-primary/20">
        <CardHeader>
          <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            <Plus size={16} className="text-primary" />
            Add New Project
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label htmlFor="proj-title">
                <FieldLabel>Title *</FieldLabel>
              </Label>
              <Input
                id="proj-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project name"
                className="font-body text-sm"
                data-ocid="admin.project_title_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-tech">
                <FieldLabel>Tech Stack (comma separated)</FieldLabel>
              </Label>
              <Input
                id="proj-tech"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="React, Spring Boot, MySQL..."
                className="font-body text-sm"
                data-ocid="admin.project_tech_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-github">
                <FieldLabel>GitHub URL</FieldLabel>
              </Label>
              <Input
                id="proj-github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="font-body text-sm"
                data-ocid="admin.project_github_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-demo">
                <FieldLabel>Demo URL</FieldLabel>
              </Label>
              <Input
                id="proj-demo"
                value={demo}
                onChange={(e) => setDemo(e.target.value)}
                placeholder="https://..."
                className="font-body text-sm"
                data-ocid="admin.project_demo_input"
              />
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            <Label htmlFor="proj-desc">
              <FieldLabel>Description *</FieldLabel>
            </Label>
            <Textarea
              id="proj-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Project description..."
              rows={3}
              className="font-body text-sm resize-none"
              data-ocid="admin.project_desc_textarea"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!title.trim() || !desc.trim() || addMutation.isPending}
            className="font-display text-xs tracking-wider uppercase gap-2"
            data-ocid="admin.add_project_button"
          >
            {addMutation.isPending ? <Spinner /> : <Plus size={14} />}
            {addMutation.isPending ? "Adding..." : "Add Project"}
          </Button>
        </CardBody>
      </Card>

      <div>
        <h3 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">
          {isLoading ? "Loading..." : `Existing Projects (${projects.length})`}
        </h3>
        {isLoading ? (
          <div className="space-y-3" data-ocid="admin.projects.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground font-body text-sm"
            data-ocid="admin.projects.empty_state"
          >
            No projects yet. Add your first project above.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((proj, i) => (
              <div
                key={String(proj.id)}
                className="bg-card border border-border/50 rounded-lg hover:border-border transition-colors duration-200"
                data-ocid={`admin.projects.item.${i + 1}`}
              >
                {editing?.id === proj.id ? (
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={editing.title}
                        onChange={(e) =>
                          setEditing({ ...editing, title: e.target.value })
                        }
                        placeholder="Title"
                        className="font-body text-sm"
                        data-ocid={`admin.edit_project_title.${i + 1}`}
                      />
                      <Input
                        value={editing.techStack}
                        onChange={(e) =>
                          setEditing({ ...editing, techStack: e.target.value })
                        }
                        placeholder="Tech stack (comma separated)"
                        className="font-body text-sm"
                        data-ocid={`admin.edit_project_tech.${i + 1}`}
                      />
                      <Input
                        value={editing.githubLink}
                        onChange={(e) =>
                          setEditing({ ...editing, githubLink: e.target.value })
                        }
                        placeholder="GitHub URL"
                        className="font-body text-sm"
                        data-ocid={`admin.edit_project_github.${i + 1}`}
                      />
                      <Input
                        value={editing.demoLink}
                        onChange={(e) =>
                          setEditing({ ...editing, demoLink: e.target.value })
                        }
                        placeholder="Demo URL"
                        className="font-body text-sm"
                        data-ocid={`admin.edit_project_demo.${i + 1}`}
                      />
                    </div>
                    <Textarea
                      value={editing.description}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                      rows={2}
                      className="font-body text-sm resize-none"
                      data-ocid={`admin.edit_project_desc.${i + 1}`}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdate}
                        disabled={updateMutation.isPending}
                        className="gap-1.5 font-display text-xs tracking-wider uppercase"
                        data-ocid={`admin.save_project_button.${i + 1}`}
                      >
                        {updateMutation.isPending ? (
                          <Spinner />
                        ) : (
                          <Check size={12} />
                        )}{" "}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(null)}
                        className="gap-1.5 font-display text-xs tracking-wider uppercase border-border/50"
                        data-ocid={`admin.cancel_edit_button.${i + 1}`}
                      >
                        <X size={12} /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm text-foreground truncate mb-1">
                        {proj.title}
                      </p>
                      <p className="font-body text-xs text-muted-foreground line-clamp-1 mb-2">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.slice(0, 4).map((t) => (
                          <Tag key={t} variant="silver">
                            {t}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            id: proj.id,
                            title: proj.title,
                            description: proj.description,
                            techStack: proj.techStack.join(", "),
                            githubLink: proj.githubLink ?? "",
                            demoLink: proj.demoLink ?? "",
                          })
                        }
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                        aria-label={`Edit ${proj.title}`}
                        data-ocid={`admin.edit_project_button.${i + 1}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(proj.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200"
                        aria-label={`Delete ${proj.title}`}
                        data-ocid={`admin.delete_project_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Certificates Tab ─────────────────────────────────────────────────────────

function CertificatesTab({ actor }: { actor: ReturnType<typeof createActor> }) {
  const qc = useQueryClient();
  const [certTitle, setCertTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ["admin-certificates"],
    queryFn: () => actor.listCertificates(),
  });

  const addMutation = useMutation({
    mutationFn: (input: AddCertificateInput) => actor.addCertificate(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-certificates"] });
      qc.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate uploaded successfully");
      setCertTitle("");
      setIssuer("");
      setDate("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => actor.deleteCertificate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-certificates"] });
      qc.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate deleted");
    },
    onError: () => toast.error("Failed to delete certificate"),
  });

  const handleUpload = async () => {
    if (!certTitle.trim() || !issuer.trim() || !file) return;
    setUploading(true);
    try {
      const fileUrl = await uploadFile(file);
      await addMutation.mutateAsync({
        title: certTitle.trim(),
        issuer: issuer.trim(),
        date: date.trim() || new Date().getFullYear().toString(),
        fileAssetId: fileUrl,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Certificate upload failed: ${error.message}`
          : "Certificate upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card variant="glass" hover={false} className="border-primary/20">
        <CardHeader>
          <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            <Upload size={16} className="text-primary" /> Upload Certificate
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label htmlFor="cert-title">
                <FieldLabel>Certificate Title *</FieldLabel>
              </Label>
              <Input
                id="cert-title"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="AWS Cloud Practitioner"
                className="font-body text-sm"
                data-ocid="admin.cert_title_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cert-issuer">
                <FieldLabel>Issuer *</FieldLabel>
              </Label>
              <Input
                id="cert-issuer"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Amazon Web Services"
                className="font-body text-sm"
                data-ocid="admin.cert_issuer_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cert-date">
                <FieldLabel>Date</FieldLabel>
              </Label>
              <Input
                id="cert-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2024"
                className="font-body text-sm"
                data-ocid="admin.cert_date_input"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label className="font-mono text-xs tracking-wider uppercase text-muted-foreground block mb-2">
              Certificate File (PDF / Image) *
            </Label>
            <label
              htmlFor="cert-file"
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              data-ocid="admin.cert_file_dropzone"
            >
              <Upload size={20} className="text-muted-foreground mb-2" />
              <span className="font-mono text-xs text-muted-foreground">
                {file ? file.name : "Click to upload PDF or image"}
              </span>
              <input
                id="cert-file"
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <Button
            onClick={handleUpload}
            disabled={
              uploading ||
              addMutation.isPending ||
              !certTitle.trim() ||
              !issuer.trim() ||
              !file
            }
            className="font-display text-xs tracking-wider uppercase gap-2"
            data-ocid="admin.upload_cert_button"
          >
            {uploading || addMutation.isPending ? (
              <Spinner />
            ) : (
              <Upload size={14} />
            )}
            {uploading || addMutation.isPending
              ? "Uploading..."
              : "Upload Certificate"}
          </Button>
        </CardBody>
      </Card>

      <div>
        <h3 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">
          {isLoading ? "Loading..." : `Certificates (${certificates.length})`}
        </h3>
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin.certificates.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground font-body text-sm"
            data-ocid="admin.certificates.empty_state"
          >
            No certificates yet. Upload your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert, i) => (
              <div
                key={String(cert.id)}
                className="flex items-center justify-between gap-4 p-4 bg-card border border-border/50 rounded-lg hover:border-border transition-colors duration-200"
                data-ocid={`admin.certificates.item.${i + 1}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Award size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground truncate">
                      {cert.title}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(cert.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200 shrink-0"
                  aria-label={`Delete ${cert.title}`}
                  data-ocid={`admin.delete_cert_button.${i + 1}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Resume Tab ───────────────────────────────────────────────────────────────

function ResumeTab({ actor }: { actor: ReturnType<typeof createActor> }) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: currentAssetId, isLoading: resumeLoading } = useQuery<
    string | null
  >({
    queryKey: ["admin-resume"],
    queryFn: () => actor.getResumeAssetId(),
  });

  const updateMutation = useMutation({
    mutationFn: (assetId: string) => actor.updateResumeAssetId(assetId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-resume"] });
      qc.invalidateQueries({ queryKey: ["portfolio-settings"] });
      toast.success("Resume updated — now available for download");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: () => toast.error("Failed to update resume"),
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      await updateMutation.mutateAsync(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Resume upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="p-4 bg-card border border-border/50 rounded-lg">
        <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-2">
          Current Status
        </p>
        {resumeLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : currentAssetId ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-body text-sm text-foreground">
              Resume active
            </span>
            <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">
              ({currentAssetId})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="font-body text-sm text-muted-foreground">
              No resume uploaded
            </span>
          </div>
        )}
      </div>

      <Card variant="glass" hover={false} className="border-primary/20">
        <CardHeader>
          <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            <Upload size={16} className="text-primary" /> Upload Resume
          </h3>
          <p className="font-body text-xs text-muted-foreground mt-1">
            The uploaded PDF will replace the current resume download link.
          </p>
        </CardHeader>
        <CardBody>
          <label
            htmlFor="resume-file"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 mb-4"
            data-ocid="admin.resume_dropzone"
          >
            <Upload size={24} className="text-muted-foreground mb-2" />
            <span className="font-mono text-sm text-muted-foreground">
              {file ? file.name : "Click to upload PDF"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60 mt-1">
              PDF only, max 10MB
            </span>
            <input
              id="resume-file"
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button
            onClick={handleUpload}
            disabled={uploading || updateMutation.isPending || !file}
            className="w-full font-display text-sm tracking-wider uppercase gap-2 shadow-orange-glow"
            data-ocid="admin.upload_resume_button"
          >
            {uploading || updateMutation.isPending ? (
              <Spinner />
            ) : (
              <Upload size={15} />
            )}
            {uploading || updateMutation.isPending
              ? "Uploading..."
              : "Upload & Save Resume"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────────────────────────

function ExperienceTab() {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<Experience[]>(() => {
    const stored = localStorage.getItem("portfolio_experience");
    return stored ? (JSON.parse(stored) as Experience[]) : defaultExperience;
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [editBuf, setEditBuf] = useState<Experience | null>(null);

  // Add form
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newPeriod, setNewPeriod] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTech, setNewTech] = useState("");

  const persist = (next: Experience[]) => {
    setEntries(next);
    localStorage.setItem("portfolio_experience", JSON.stringify(next));
    window.dispatchEvent(new Event("portfolio:experience-updated"));
    void fetch("/api/admin/settings/experience", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: next }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Could not save experience to the database.");
        void queryClient.invalidateQueries({ queryKey: ["experience"] });
      })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Could not save experience.",
        );
      });
  };

  const handleAdd = () => {
    if (!newRole.trim() || !newCompany.trim()) return;
    persist([
      ...entries,
      {
        role: newRole.trim(),
        company: newCompany.trim(),
        period: newPeriod.trim(),
        description: newDesc.trim(),
        tech: newTech
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    ]);
    setNewRole("");
    setNewCompany("");
    setNewPeriod("");
    setNewDesc("");
    setNewTech("");
    toast.success("Experience entry added");
  };

  const handleSave = (i: number) => {
    if (!editBuf) return;
    const next = entries.map((e, idx) => (idx === i ? editBuf : e));
    persist(next);
    setEditing(null);
    setEditBuf(null);
    toast.success("Experience updated");
  };

  const handleDelete = (i: number) => {
    persist(entries.filter((_, idx) => idx !== i));
    toast.success("Entry removed");
  };

  return (
    <div className="space-y-8">
      <Card variant="glass" hover={false} className="border-primary/20">
        <CardHeader>
          <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            <Plus size={16} className="text-primary" /> Add Experience Entry
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label htmlFor="exp-role">
                <FieldLabel>Role / Title *</FieldLabel>
              </Label>
              <Input
                id="exp-role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Full Stack Developer"
                className="font-body text-sm"
                data-ocid="admin.exp_role_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp-company">
                <FieldLabel>Company *</FieldLabel>
              </Label>
              <Input
                id="exp-company"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Cepia Labs"
                className="font-body text-sm"
                data-ocid="admin.exp_company_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp-period">
                <FieldLabel>Period</FieldLabel>
              </Label>
              <Input
                id="exp-period"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                placeholder="Dec 2025 – Apr 2026"
                className="font-body text-sm"
                data-ocid="admin.exp_period_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp-tech">
                <FieldLabel>Tech (comma separated)</FieldLabel>
              </Label>
              <Input
                id="exp-tech"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="React, Next.js, TypeScript..."
                className="font-body text-sm"
                data-ocid="admin.exp_tech_input"
              />
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            <Label htmlFor="exp-desc">
              <FieldLabel>Description</FieldLabel>
            </Label>
            <Textarea
              id="exp-desc"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What did you do here..."
              rows={3}
              className="font-body text-sm resize-none"
              data-ocid="admin.exp_desc_textarea"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newRole.trim() || !newCompany.trim()}
            className="font-display text-xs tracking-wider uppercase gap-2"
            data-ocid="admin.add_experience_button"
          >
            <Plus size={14} /> Add Entry
          </Button>
        </CardBody>
      </Card>

      <div>
        <h3 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">
          Experience Entries ({entries.length})
        </h3>
        <div className="space-y-3">
          {entries.map((exp, i) => (
            <div
              key={`${exp.company}-${i}`}
              className="bg-card border border-border/50 rounded-lg"
              data-ocid={`admin.experience.item.${i + 1}`}
            >
              {editing === i && editBuf ? (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={editBuf.role}
                      onChange={(e) =>
                        setEditBuf({ ...editBuf, role: e.target.value })
                      }
                      placeholder="Role"
                      className="font-body text-sm"
                    />
                    <Input
                      value={editBuf.company}
                      onChange={(e) =>
                        setEditBuf({ ...editBuf, company: e.target.value })
                      }
                      placeholder="Company"
                      className="font-body text-sm"
                    />
                    <Input
                      value={editBuf.period}
                      onChange={(e) =>
                        setEditBuf({ ...editBuf, period: e.target.value })
                      }
                      placeholder="Period"
                      className="font-body text-sm"
                    />
                    <Input
                      value={editBuf.tech.join(", ")}
                      onChange={(e) =>
                        setEditBuf({
                          ...editBuf,
                          tech: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Tech (comma separated)"
                      className="font-body text-sm"
                    />
                  </div>
                  <Textarea
                    value={editBuf.description}
                    onChange={(e) =>
                      setEditBuf({ ...editBuf, description: e.target.value })
                    }
                    rows={2}
                    className="font-body text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(i)}
                      className="gap-1.5 font-display text-xs tracking-wider uppercase"
                      data-ocid={`admin.save_experience_button.${i + 1}`}
                    >
                      <Check size={12} /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(null);
                        setEditBuf(null);
                      }}
                      className="gap-1.5 font-display text-xs tracking-wider uppercase border-border/50"
                      data-ocid={`admin.cancel_experience_button.${i + 1}`}
                    >
                      <X size={12} /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-foreground">
                      {exp.role}
                    </p>
                    <p className="font-body text-xs text-primary mb-1">
                      {exp.company} · {exp.period}
                    </p>
                    <p className="font-body text-xs text-muted-foreground line-clamp-2">
                      {exp.description}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(i);
                        setEditBuf({ ...exp });
                      }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                      aria-label={`Edit ${exp.role}`}
                      data-ocid={`admin.edit_experience_button.${i + 1}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(i)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200"
                      aria-label={`Delete ${exp.role}`}
                      data-ocid={`admin.delete_experience_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Education Tab ────────────────────────────────────────────────────────────

function EducationTab() {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<Education[]>(() => {
    const stored = localStorage.getItem("portfolio_education");
    return stored ? (JSON.parse(stored) as Education[]) : defaultEducation;
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [editBuf, setEditBuf] = useState<Education | null>(null);

  const [newInstitution, setNewInstitution] = useState("");
  const [newDegree, setNewDegree] = useState("");
  const [newPeriod, setNewPeriod] = useState("");
  const [newGpa, setNewGpa] = useState("");

  const persist = (next: Education[]) => {
    setEntries(next);
    localStorage.setItem("portfolio_education", JSON.stringify(next));
    window.dispatchEvent(new Event("portfolio:education-updated"));
    void fetch("/api/admin/settings/education", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: next }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Could not save education to the database.");
        void queryClient.invalidateQueries({ queryKey: ["education"] });
      })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Could not save education.",
        );
      });
  };

  const handleAdd = () => {
    if (!newInstitution.trim() || !newDegree.trim()) return;
    persist([
      ...entries,
      {
        institution: newInstitution.trim(),
        degree: newDegree.trim(),
        period: newPeriod.trim(),
        gpa: newGpa.trim() || undefined,
      },
    ]);
    setNewInstitution("");
    setNewDegree("");
    setNewPeriod("");
    setNewGpa("");
    toast.success("Education entry added");
  };

  const handleSave = (i: number) => {
    if (!editBuf) return;
    persist(entries.map((e, idx) => (idx === i ? editBuf : e)));
    setEditing(null);
    setEditBuf(null);
    toast.success("Education updated");
  };

  const handleDelete = (i: number) => {
    persist(entries.filter((_, idx) => idx !== i));
    toast.success("Entry removed");
  };

  return (
    <div className="space-y-8">
      <Card variant="glass" hover={false} className="border-primary/20">
        <CardHeader>
          <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            <Plus size={16} className="text-primary" /> Add Education Entry
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label htmlFor="edu-institution">
                <FieldLabel>Institution *</FieldLabel>
              </Label>
              <Input
                id="edu-institution"
                value={newInstitution}
                onChange={(e) => setNewInstitution(e.target.value)}
                placeholder="Alva's Institute of Engineering"
                className="font-body text-sm"
                data-ocid="admin.edu_institution_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edu-degree">
                <FieldLabel>Degree *</FieldLabel>
              </Label>
              <Input
                id="edu-degree"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="Bachelor of Engineering in CS"
                className="font-body text-sm"
                data-ocid="admin.edu_degree_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edu-period">
                <FieldLabel>Period</FieldLabel>
              </Label>
              <Input
                id="edu-period"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                placeholder="2020 – 2024"
                className="font-body text-sm"
                data-ocid="admin.edu_period_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edu-gpa">
                <FieldLabel>GPA</FieldLabel>
              </Label>
              <Input
                id="edu-gpa"
                value={newGpa}
                onChange={(e) => setNewGpa(e.target.value)}
                placeholder="8.2 / 10"
                className="font-body text-sm"
                data-ocid="admin.edu_gpa_input"
              />
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newInstitution.trim() || !newDegree.trim()}
            className="font-display text-xs tracking-wider uppercase gap-2"
            data-ocid="admin.add_education_button"
          >
            <Plus size={14} /> Add Entry
          </Button>
        </CardBody>
      </Card>

      <div>
        <h3 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">
          Education Entries ({entries.length})
        </h3>
        <div className="space-y-3">
          {entries.map((edu, i) => (
            <div
              key={`${edu.institution}-${i}`}
              className="bg-card border border-border/50 rounded-lg"
              data-ocid={`admin.education.item.${i + 1}`}
            >
              {editing === i && editBuf ? (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={editBuf.institution}
                      onChange={(e) =>
                        setEditBuf({ ...editBuf, institution: e.target.value })
                      }
                      placeholder="Institution"
                      className="font-body text-sm"
                    />
                    <Input
                      value={editBuf.degree}
                      onChange={(e) =>
                        setEditBuf({ ...editBuf, degree: e.target.value })
                      }
                      placeholder="Degree"
                      className="font-body text-sm"
                    />
                    <Input
                      value={editBuf.period}
                      onChange={(e) =>
                        setEditBuf({ ...editBuf, period: e.target.value })
                      }
                      placeholder="Period"
                      className="font-body text-sm"
                    />
                    <Input
                      value={editBuf.gpa ?? ""}
                      onChange={(e) =>
                        setEditBuf({
                          ...editBuf,
                          gpa: e.target.value || undefined,
                        })
                      }
                      placeholder="GPA"
                      className="font-body text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(i)}
                      className="gap-1.5 font-display text-xs tracking-wider uppercase"
                      data-ocid={`admin.save_education_button.${i + 1}`}
                    >
                      <Check size={12} /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(null);
                        setEditBuf(null);
                      }}
                      className="gap-1.5 font-display text-xs tracking-wider uppercase border-border/50"
                      data-ocid={`admin.cancel_education_button.${i + 1}`}
                    >
                      <X size={12} /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-foreground">
                      {edu.degree}
                    </p>
                    <p className="font-body text-xs text-primary mb-1">
                      {edu.institution}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {edu.period}
                      {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(i);
                        setEditBuf({ ...edu });
                      }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                      aria-label={`Edit ${edu.institution}`}
                      data-ocid={`admin.edit_education_button.${i + 1}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(i)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200"
                      aria-label={`Delete ${edu.institution}`}
                      data-ocid={`admin.delete_education_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoreTechnologiesTab() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading, isError } = usePortfolioSettings();
  const [entries, setEntries] = useState(defaultCoreTechnologies);
  const [newTechnology, setNewTechnology] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings?.core_technologies) return;
    try {
      const parsed: unknown = JSON.parse(settings.core_technologies);
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === "string")
      ) {
        setEntries(parsed);
      }
    } catch (error) {
      console.error("Unable to parse saved core technologies.", error);
    }
  }, [settings?.core_technologies]);

  const addTechnology = () => {
    const value = newTechnology.trim();
    if (!value || entries.includes(value)) return;
    setEntries([...entries, value]);
    setNewTechnology("");
  };

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/core_technologies", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to save core technologies.");
      }
      await queryClient.invalidateQueries({ queryKey: ["portfolio-settings"] });
      toast.success("Core technologies updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save core technologies.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="glass" hover={false} className="border-primary/20">
      <CardHeader>
        <h3 className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-2">
          <Zap size={16} className="text-primary" />
          Core Technologies
        </h3>
        <p className="font-body text-xs text-muted-foreground mt-1">
          These entries appear in the Core Technologies section on the About
          page.
        </p>
      </CardHeader>
      <CardBody className="space-y-5">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading saved technologies…
          </p>
        )}
        {isError && (
          <p role="alert" className="text-sm text-destructive">
            Could not load saved portfolio settings.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {entries.map((technology, index) => (
            <span
              key={technology}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              {technology}
              <button
                type="button"
                onClick={() =>
                  setEntries(
                    entries.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${technology}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newTechnology}
            onChange={(event) => setNewTechnology(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTechnology();
              }
            }}
            placeholder="Add a technology"
            className="font-body text-sm"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addTechnology}
            disabled={!newTechnology.trim()}
            className="gap-2"
          >
            <Plus size={14} />
            Add
          </Button>
        </div>
        <Button
          type="button"
          onClick={() => void save()}
          disabled={saving || isLoading || isError}
          className="font-display text-xs tracking-wider uppercase gap-2"
        >
          {saving ? <Spinner /> : <Check size={14} />}
          {saving ? "Saving..." : "Save Core Technologies"}
        </Button>
      </CardBody>
    </Card>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  needsActor: boolean;
}[] = [
  {
    id: "photo",
    label: "Profile Photo",
    icon: <Camera size={15} />,
    needsActor: false,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderOpen size={15} />,
    needsActor: true,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: <Award size={15} />,
    needsActor: true,
  },
  {
    id: "resume",
    label: "Resume",
    icon: <Briefcase size={15} />,
    needsActor: true,
  },
  {
    id: "experience",
    label: "Experience",
    icon: <Briefcase size={15} />,
    needsActor: false,
  },
  {
    id: "education",
    label: "Education",
    icon: <GraduationCap size={15} />,
    needsActor: false,
  },
  {
    id: "core-tech",
    label: "Core Tech",
    icon: <Zap size={15} />,
    needsActor: false,
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { isAuthenticated, isLoading, login, logout } = useLocalAdminAuth();
  const actor = useMemo(createActor, []);
  const [activeTab, setActiveTab] = useState<AdminTab>("photo");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginGate onLogin={login} />;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-primary" />
              <h1 className="font-display font-bold text-2xl tracking-tight gradient-text-silver">
                Admin Dashboard
              </h1>
            </div>
            <p className="font-mono text-xs text-muted-foreground tracking-wider">
              Signed in as <span className="text-primary">Administrator</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void logout()}
            className="font-display text-xs tracking-wider uppercase gap-2 border-border/50 self-start sm:self-auto"
            data-ocid="admin.logout_button"
          >
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>

        {/* Tabs — scrollable row on mobile */}
        <div
          className="flex gap-1 p-1 bg-muted/40 rounded-lg border border-border/40 mb-8 overflow-x-auto"
          role="tablist"
          aria-label="Admin sections"
          data-ocid="admin.tabs"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 font-display text-xs tracking-wider uppercase px-3 py-2 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card border border-primary/30 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`admin.${tab.id}_tab`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div data-ocid="admin.content_panel">
          {activeTab === "photo" && <ProfilePhotoTab />}
          {activeTab === "experience" && <ExperienceTab />}
          {activeTab === "education" && <EducationTab />}
          {activeTab === "core-tech" && <CoreTechnologiesTab />}

          {activeTab === "projects" && <ProjectsTab actor={actor} />}
          {activeTab === "certificates" && <CertificatesTab actor={actor} />}
          {activeTab === "resume" && <ResumeTab actor={actor} />}
        </div>
      </div>
    </Layout>
  );
}
