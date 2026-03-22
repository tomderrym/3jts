# 3jAIS Control Panel (starter)

Full-stack starter: **Express + TypeScript** backend, **Vite + React + TypeScript + Tailwind** frontend.

## Features

- **Priority engine** — `(impact × businessValue × confidence) / (effort × risk × complexity)` with L/M/H → 1/2/3.
- **Goals + constraints** — `canApprove()` gates approval (no auto-approve in v1).
- **Suggestions vault** — ranked list, policy-blocked items disabled.
- **System Intelligence** — active goals, top pending, blocked list.
- **Flow Builder** — [@xyflow/react](https://reactflow.dev/) drag/connect; save/load via API (in-memory).
- **AppScannerAgent** — uses MCP-style tools only: `scan_workspace`, `read_file`, `git_status`.
- **Tools panel** — invoke tools from the UI.

## Run

```bash
cd 3jais
npm install
npm run dev
```

- Backend: [http://127.0.0.1:3847](http://127.0.0.1:3847)  
- Frontend: [http://127.0.0.1:5177](http://127.0.0.1:5177) (proxies `/api` → backend)

### Workspace root

Default scan path is the **3jts repo root** (three levels above `backend/src`). Override:

```bash
set WORKSPACE_ROOT=C:\path\to\project
set PORT=3847
npm run dev -w backend
```

## Explicitly not in v1

- Auto-approval of high scores  
- Persistent DB (vault resets on server restart)  
- Real Git apply from approve button  

Add those after validation + storage (`feature-os/` Postgres) when you are ready.

## Aligns with

- `AI-AGENCY-ARCHITECTURE.md` — governed autonomy, CSIL-friendly.
