# Sagar M H Portfolio

React/Vite portfolio with an Express API, SQLite database, and local file
uploads. It runs locally and can be deployed as one full-stack Render web
service using the included `render.yaml` configuration.

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer

## Run on Windows

Open PowerShell in this folder and run:

```powershell
pnpm install
pnpm dev
```

The Vite frontend runs at `http://localhost:5173`; its `/api` requests are
proxied to the Express API on `http://127.0.0.1:4000`.

On first start, a random local administrator password is generated in
`data/admin-password.txt`. Open `/admin` and enter the password shown by:

```powershell
Get-Content .\data\admin-password.txt
```

Keep this file private. It is excluded from Git. To set a password yourself,
stop the app, set `ADMIN_PASSWORD` in the current PowerShell window, then start
the app again:

```powershell
$env:ADMIN_PASSWORD = "choose-a-long-unique-password"
pnpm dev
```

The SQLite database is stored in `data/portfolio.sqlite`; uploaded files are
stored in `uploads/`. Both directories are local runtime data and are excluded
from Git. Back them up if you want to preserve local edits and uploads.

Stop both development servers with **Ctrl+C**.

## Build and typecheck

```powershell
pnpm typecheck
pnpm build
```

## Deploy the full stack to Render

The included `render.yaml` configures a Node web service and a persistent disk
for the SQLite database and uploaded files. The service uses a paid Starter
instance because Render's free web services do not provide persistent disks.

1. Back up `data/` and `uploads/` locally. These ignored folders are never
   included in Git or copied automatically to Render.
2. Push this project to a private or public GitHub repository. Do not commit
   `data/admin-password.txt`, database files, uploads, or secrets.
3. In Render, choose **New > Blueprint**, connect the GitHub repository, and
   confirm the `sagar-portfolio` service and persistent disk from `render.yaml`.
4. Set `ADMIN_PASSWORD` when prompted. Use a strong, unique password and keep
   it in a password manager; do not put it in the repository.
5. Create the Blueprint. Render installs dependencies, builds the frontend,
   starts the Express server, and waits for `/api/health`.
6. Open the deployed URL and `/admin`. Sign in with the password you set.
   Confirm projects, certificates, and uploads work before sharing the URL.

The first deployment creates a new database with the app's default portfolio
entries. It does not import your local SQLite contents or uploaded files. If
you have customized data locally, keep your backup and plan a separate
migration before relying on the deployed copy.
