import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, 'backend');

console.log('\x1b[36m%s\x1b[0m', '🚀 Launching Paradigm Shift (Backend + Frontend)...');

// Check if backend/node_modules exists; if not, auto-install dependencies
if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
  console.log('\x1b[33m%s\x1b[0m', '📦 Installing backend dependencies (first-time setup)...');
  try {
    execSync('npm install', { cwd: backendDir, stdio: 'inherit' });
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to install backend dependencies:', err.message);
  }
}

// Spawn Backend Server with CWD set to backend directory
const backend = spawn('node', ['server.js'], {
  cwd: backendDir,
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Spawn Frontend Vite Server from root directory
const frontend = spawn('npx', ['vite'], {
  cwd: __dirname,
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

function formatLog(prefix, color, data) {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${color}[${prefix}]\x1b[0m ${line}`);
    }
  });
}

backend.stdout.on('data', (data) => formatLog('BACKEND', '\x1b[35m', data));
backend.stderr.on('data', (data) => formatLog('BACKEND ERROR', '\x1b[31m', data));

frontend.stdout.on('data', (data) => formatLog('FRONTEND', '\x1b[32m', data));
frontend.stderr.on('data', (data) => formatLog('FRONTEND ERROR', '\x1b[31m', data));

function cleanup() {
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down dev servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
