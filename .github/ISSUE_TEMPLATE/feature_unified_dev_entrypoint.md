---
name: Feature Request - Unified Dev Server Entrypoint & Vercel Deployment Architecture
about: Propose a single entrypoint script to run frontend and backend concurrently, and document Vercel deployment feasibility.
title: 'feat: Add unified dev script for concurrent frontend and backend execution'
labels: 'enhancement, dev-dx, deployment'
assignees: ''
---

## Problem Statement
Currently, running `npm run dev` at the repository root only starts the Vite frontend server on `http://localhost:5173`. The Express backend API (`http://localhost:5050`) must be started in a separate terminal process (`cd backend && node server.js`). 

When developers forget to launch the backend service, authentication and API requests fail with unhandled network errors (`ECONNREFUSED`).

## Proposed Solution
1. **Unified Dev Entrypoint**: Update the root `package.json` scripts to run both the backend server (`node backend/server.js` / `npm --prefix backend dev`) and the frontend client (`vite`) concurrently using a single command (`npm run dev`).
2. **Single Entrypoint Script**: Provide a `start-all.js` or `concurrently` script in the root directory to orchestrate child processes for local development.

## Vercel Deployment Feasibility Analysis

### ✅ What works on Vercel:
- **Frontend + Backend Monorepo Routing**: Vercel supports hosting static/Vite frontends alongside Node.js API routes using `vercel.json` rewrites or `experimentalServices`.
- **API Rewrites**: Routing `/api/*` requests directly to the backend function without CORS configuration issues.

### ⚠️ Constraints & Required Adjustments for Vercel:
1. **Stateless Serverless Execution**:
   - Vercel executes Node.js endpoints as short-lived Serverless Functions.
   - The fallback `mongodb-memory-server` will reset state on cold starts. **Must use a hosted MongoDB Atlas database**.
2. **WebSocket (Socket.io) Support**:
   - Serverless functions cannot maintain persistent TCP/WebSocket connections (`io.on('connection')`).
   - For real-time features on Vercel, real-time WebSocket traffic must be hosted on a persistent server (e.g., Render, Railway, Fly.io) or delegated to a managed service like Pusher/Ably.

## Acceptance Criteria
- [ ] `npm run dev` at root launches both frontend (port 5173/5174) and backend (port 5050) concurrently.
- [ ] Server log output is cleanly prefixed for both services.
- [ ] Vercel deployment documentation updated with MongoDB Atlas and WebSocket hosting instructions.
