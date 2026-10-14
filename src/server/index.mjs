import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import express from "express";
import multer from "multer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = path.resolve(process.env.DATA_DIR ?? path.join(root, "data"));
const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? path.join(root, "uploads"));
const frontendDist = path.join(root, "src", "frontend", "dist");
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const passwordFile = path.join(dataDir, "admin-password.txt");
if (!process.env.ADMIN_PASSWORD && !fs.existsSync(passwordFile)) {
  fs.writeFileSync(passwordFile, crypto.randomBytes(18).toString("base64url"), {
    flag: "wx",
    mode: 0o600,
  });
  console.log(`Generated local admin password. Save it from: ${passwordFile}`);
}
const adminPassword =
  process.env.ADMIN_PASSWORD ?? fs.readFileSync(passwordFile, "utf8").trim();

const db = new Database(path.join(dataDir, "portfolio.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL DEFAULT '[]',
    github_link TEXT,
    demo_link TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    tech TEXT NOT NULL DEFAULT '[]'
  );
  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    period TEXT NOT NULL,
    gpa TEXT,
    score_label TEXT
  );
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
`);

if (db.prepare("SELECT COUNT(*) AS count FROM projects").get().count === 0) {
  const insert = db.prepare(
    "INSERT INTO projects (title, description, tech_stack, github_link, demo_link) VALUES (?, ?, ?, ?, ?)",
  );
  const seed = db.transaction(() => {
    insert.run(
      "Fintech Payment Integration System",
      "A comprehensive payment integration platform supporting multiple payment gateways, real-time transaction processing, and secure fund transfers. Implements UPI, NEFT, and card payment flows with robust error handling and transaction reconciliation.",
      JSON.stringify(["React", "Spring Boot", "Java", "MySQL", "REST APIs"]),
      "",
      "https://stripe-provider-service-19ir.onrender.com",
    );
    insert.run(
      "Food E-Commerce Platform",
      "A complete online food ordering and delivery platform with product catalogs, cart management, checkout flows, and order tracking for a seamless customer experience.",
      JSON.stringify(["React", "Java", "Spring Boot", "MySQL", "E-Commerce"]),
      "",
      "",
    );
  });
  seed();
}
if (db.prepare("SELECT COUNT(*) AS count FROM certificates").get().count === 0) {
  const insert = db.prepare(
    "INSERT INTO certificates (title, issuer, date, file_url) VALUES (?, ?, ?, ?)",
  );
  insert.run("Salesforce Administrator", "Trailhead", "2024", "");
  insert.run("Java Wipro Fullstack Certification", "Wipro", "2024", "");
  insert.run(
    "Spring Boot Microservices Application with GCP Cloud",
    "Coursera",
    "2025",
    "",
  );
}
if (db.prepare("SELECT COUNT(*) AS count FROM experience").get().count === 0) {
  const insert = db.prepare(
    "INSERT INTO experience (company, role, period, description, tech) VALUES (?, ?, ?, ?, ?)",
  );
  insert.run(
    "Cepia Labs",
    "Full Stack Developer | Frontend Developer",
    "December 2025 – April 2026",
    "Built and designed frontend dashboard pages using React and Next.js. Created interactive UI components and design prototypes with Excalidraw. Contributed to full-stack features and dashboard architecture.",
    JSON.stringify(["React", "Next.js", "TypeScript", "Tailwind CSS"]),
  );
  insert.run(
    "HulkHire",
    "Java Developer Trainee",
    "Aug 2025 – Sep 2025",
    "Built a fintech project integrating Stripe Payments, Spring Boot, REST APIs, and MySQL. Worked with microservices, API integrations, and AWS deployments.",
    JSON.stringify(["Java", "Spring Boot", "REST APIs", "MySQL", "AWS"]),
  );
}
if (db.prepare("SELECT COUNT(*) AS count FROM education").get().count === 0) {
  const insert = db.prepare(
    "INSERT INTO education (institution, degree, period, gpa, score_label) VALUES (?, ?, ?, ?, ?)",
  );
  insert.run(
    "Alva's Institute of Engineering and Technology",
    "Bachelor of Engineering in Computer Science",
    "2021 – 2025",
    "7.44 / 10",
    "GPA",
  );
  insert.run(
    "K.L.E. Society's P.C. Jabin Science College, Vidyanagar, Hubli",
    "Science",
    "2019 – 2021",
    "67 / 100",
    "Percentage",
  );
}
db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('core_technologies', ?)").run(
  JSON.stringify([
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
  ]),
);

const sessions = new Map();
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDir, { dotfiles: "deny" }));

const publicProject = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  techStack: JSON.parse(row.tech_stack),
  githubLink: row.github_link,
  demoLink: row.demo_link,
});
const publicCertificate = (row) => ({
  id: row.id,
  title: row.title,
  issuer: row.issuer,
  date: row.date,
  fileAssetId: row.file_url,
});
const publicExperience = (row) => ({
  id: row.id,
  company: row.company,
  role: row.role,
  period: row.period,
  description: row.description,
  tech: JSON.parse(row.tech),
});
const publicEducation = (row) => ({
  id: row.id,
  institution: row.institution,
  degree: row.degree,
  period: row.period,
  gpa: row.gpa,
  scoreLabel: row.score_label,
});

function requireAdmin(req, res, next) {
  const cookie = req.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)portfolio_session=([^;]+)/);
  if (match && sessions.has(match[1])) return next();
  return res.status(401).json({ error: "Sign in as administrator to continue." });
}

app.post("/api/auth/login", (req, res) => {
  const supplied = typeof req.body?.password === "string" ? req.body.password : "";
  const actual = Buffer.from(adminPassword);
  const incoming = Buffer.from(supplied);
  if (incoming.length !== actual.length || !crypto.timingSafeEqual(incoming, actual)) {
    return res.status(401).json({ error: "Incorrect admin password." });
  }
  const sessionId = crypto.randomBytes(32).toString("base64url");
  sessions.set(sessionId, true);
  res.setHeader(
    "Set-Cookie",
    `portfolio_session=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
  return res.json({ authenticated: true });
});
app.get("/api/auth/status", (req, res) => {
  const match = (req.get("cookie") ?? "").match(/(?:^|;\s*)portfolio_session=([^;]+)/);
  res.json({ authenticated: Boolean(match && sessions.has(match[1])) });
});
app.post("/api/auth/logout", (req, res) => {
  const match = (req.get("cookie") ?? "").match(/(?:^|;\s*)portfolio_session=([^;]+)/);
  if (match) sessions.delete(match[1]);
  res.setHeader(
    "Set-Cookie",
    "portfolio_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
  );
  res.json({ authenticated: false });
});

app.get("/api/projects", (_req, res) => {
  res.json(db.prepare("SELECT * FROM projects ORDER BY id").all().map(publicProject));
});
app.get("/api/certificates", (_req, res) => {
  res.json(
    db.prepare("SELECT * FROM certificates ORDER BY id").all().map(publicCertificate),
  );
});
app.get("/api/experience", (_req, res) => {
  res.json(db.prepare("SELECT * FROM experience ORDER BY id").all().map(publicExperience));
});
app.get("/api/education", (_req, res) => {
  res.json(db.prepare("SELECT * FROM education ORDER BY id").all().map(publicEducation));
});
app.get("/api/settings", (_req, res) => {
  res.json(Object.fromEntries(db.prepare("SELECT key, value FROM settings").all().map((r) => [r.key, r.value])));
});

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, done) => {
      const ext = path.extname(file.originalname).toLowerCase();
      done(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, done) => {
    const allowed = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
    if (!allowed.has(file.mimetype)) {
      done(new Error("Upload a PDF, JPG, PNG, or WEBP file."));
      return;
    }
    done(null, true);
  },
});
app.post("/api/uploads", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choose a file to upload." });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use("/api/admin", requireAdmin);
app.post("/api/admin/projects", (req, res) => {
  const { title, description, techStack = [], githubLink = "", demoLink = "" } = req.body;
  if (!title?.trim() || !description?.trim()) return res.status(400).json({ error: "Title and description are required." });
  const result = db.prepare(
    "INSERT INTO projects (title, description, tech_stack, github_link, demo_link) VALUES (?, ?, ?, ?, ?)",
  ).run(title.trim(), description.trim(), JSON.stringify(techStack), githubLink, demoLink);
  res.status(201).json(publicProject(db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid)));
});
app.put("/api/admin/projects/:id", (req, res) => {
  const { title, description, techStack = [], githubLink = "", demoLink = "" } = req.body;
  const result = db.prepare(
    "UPDATE projects SET title=?, description=?, tech_stack=?, github_link=?, demo_link=? WHERE id=?",
  ).run(title, description, JSON.stringify(techStack), githubLink, demoLink, Number(req.params.id));
  res.json({ success: result.changes > 0 });
});
app.delete("/api/admin/projects/:id", (req, res) => {
  const result = db.prepare("DELETE FROM projects WHERE id=?").run(Number(req.params.id));
  res.json({ success: result.changes > 0 });
});
app.post("/api/admin/certificates", (req, res) => {
  const { title, issuer, date, fileAssetId } = req.body;
  if (!title?.trim() || !issuer?.trim() || !fileAssetId) return res.status(400).json({ error: "Title, issuer and certificate file are required." });
  const result = db.prepare(
    "INSERT INTO certificates (title, issuer, date, file_url) VALUES (?, ?, ?, ?)",
  ).run(title.trim(), issuer.trim(), date, fileAssetId);
  res.status(201).json(publicCertificate(db.prepare("SELECT * FROM certificates WHERE id=?").get(result.lastInsertRowid)));
});
app.delete("/api/admin/certificates/:id", (req, res) => {
  const result = db.prepare("DELETE FROM certificates WHERE id=?").run(Number(req.params.id));
  res.json({ success: result.changes > 0 });
});
app.get("/api/admin/resume", (_req, res) => {
  res.json({ url: db.prepare("SELECT value FROM settings WHERE key='resume_url'").get()?.value ?? null });
});
app.put("/api/admin/resume", (req, res) => {
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('resume_url', ?)").run(req.body.url ?? "");
  res.json({ success: true });
});
app.put("/api/admin/settings/:key", (req, res) => {
  if (req.params.key === "photo_url") {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('photo_url', ?)").run(req.body.value ?? "");
    return res.json({ success: true });
  }
  if (req.params.key === "core_technologies") {
    if (!Array.isArray(req.body.entries) || !req.body.entries.every((item) => typeof item === "string" && item.trim())) {
      return res.status(400).json({ error: "Core technologies must be a list of non-empty strings." });
    }
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('core_technologies', ?)").run(
      JSON.stringify(req.body.entries.map((item) => item.trim())),
    );
    return res.json({ success: true });
  }
  if (!["experience", "education"].includes(req.params.key)) return res.status(404).json({ error: "Unknown setting." });
  const table = req.params.key;
  const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
  const transaction = db.transaction(() => {
    db.prepare(`DELETE FROM ${table}`).run();
    if (table === "experience") {
      const insert = db.prepare("INSERT INTO experience (company, role, period, description, tech) VALUES (?, ?, ?, ?, ?)");
      for (const item of entries) insert.run(item.company, item.role, item.period, item.description, JSON.stringify(item.tech ?? []));
    } else {
      const insert = db.prepare("INSERT INTO education (institution, degree, period, gpa, score_label) VALUES (?, ?, ?, ?, ?)");
      for (const item of entries) insert.run(item.institution, item.degree, item.period, item.gpa ?? null, item.scoreLabel ?? null);
    }
  });
  transaction();
  res.json({ success: true });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});
app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error instanceof multer.MulterError ? 400 : error.message?.startsWith("Upload ") ? 400 : 500;
  res.status(status).json({ error: error.message || "Unexpected server error." });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio server ready on port ${port}`);
});
