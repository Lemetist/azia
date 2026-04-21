#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend/django_app"
FRONTEND_DIR="$ROOT_DIR/frontend"
FRONTEND_ENV_EXAMPLE="$FRONTEND_DIR/.env.local.example"
FRONTEND_ENV_LOCAL="$FRONTEND_DIR/.env.local"

BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

BACKEND_PID=""
FRONTEND_PID=""

log() {
  printf '[run-local] %s\n' "$1"
}

cleanup() {
  local exit_code=$?

  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  exit "$exit_code"
}

trap cleanup EXIT INT TERM

prepare_frontend_env() {
  if [[ ! -f "$FRONTEND_ENV_LOCAL" ]] && [[ -f "$FRONTEND_ENV_EXAMPLE" ]]; then
    cp "$FRONTEND_ENV_EXAMPLE" "$FRONTEND_ENV_LOCAL"
    log "Created frontend/.env.local from template."
  fi
}

ensure_frontend_dependencies() {
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    log "Installing frontend dependencies with npm ci."
    (
      cd "$FRONTEND_DIR"
      npm ci
    )
  fi
}

resolve_backend_python() {
  if [[ -x "$BACKEND_DIR/.venv/bin/python" ]]; then
    printf '%s\n' "$BACKEND_DIR/.venv/bin/python"
    return 0
  fi

  if command -v uv >/dev/null 2>&1; then
    log "Creating backend virtual environment with uv sync."
    (
      cd "$BACKEND_DIR"
      uv sync
    )
    printf '%s\n' "$BACKEND_DIR/.venv/bin/python"
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    printf '%s\n' "python3"
    return 0
  fi

  log "Python runtime for backend was not found."
  exit 1
}

start_backend() {
  local python_bin
  python_bin="$(resolve_backend_python)"

  log "Applying Django migrations."
  (
    cd "$BACKEND_DIR"
    "$python_bin" manage.py migrate
  )

  log "Starting Django at http://$BACKEND_HOST:$BACKEND_PORT"
  (
    cd "$BACKEND_DIR"
    exec "$python_bin" manage.py runserver "$BACKEND_HOST:$BACKEND_PORT"
  ) &
  BACKEND_PID=$!
}

start_frontend() {
  log "Starting Next.js at http://$FRONTEND_HOST:$FRONTEND_PORT"
  (
    cd "$FRONTEND_DIR"
    exec npm run dev -- --hostname "$FRONTEND_HOST" --port "$FRONTEND_PORT"
  ) &
  FRONTEND_PID=$!
}

prepare_frontend_env
ensure_frontend_dependencies
start_backend
start_frontend

log "Frontend: http://$FRONTEND_HOST:$FRONTEND_PORT"
log "Backend:  http://$BACKEND_HOST:$BACKEND_PORT"
log "Press Ctrl+C to stop both processes."

wait -n "$BACKEND_PID" "$FRONTEND_PID"
